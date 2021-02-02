import { createPasswordValidator, pick, log } from '@lib';
import { fold as foldEither, Either } from 'fp-ts/Either';
import { fromNullable, Option } from 'fp-ts/Option';
import { IO } from 'fp-ts/IO';
import { fromIO, Task } from 'fp-ts/Task';
import { flow } from 'fp-ts/lib/function';
import { Logger } from 'log4js';

import {
    DatabasePoolType,
    DataIntegrityError,
    sql,
    DatabasePoolConnectionType,
} from 'slonik';

import {
    tryCatchK,
    fold as foldTE,
    chainFirst,
    fromOption,
} from 'fp-ts/TaskEither';

type Arguments = {
    userIdentifier: Either<string, string>;
    providedPassword: string;
};

type DBResults = {
    firstname: string;
    password: string;
    id: string;
};

const makeDbErrLogger = (logger: Logger) => (reason: unknown): IO<unknown> => {
    switch (true) {
    case reason instanceof DataIntegrityError:
        logger.warn(`Failed to locate user in database`);
        logger.error(
            `validateUser.ts-multiplie rows for one user-${reason}`,
        );
        break;
    case reason instanceof Error:
        logger.error(`Unknown Error while validating`);
        logger.debug(`validateUser.ts-Unknown error-${reason}`);
    }

    return () => reason;
};

const makeValidationErrLogger = (logger: Logger) => (
    reason: unknown,
): IO<unknown> => {
    logger.error(`Failed to verify user via password`);
    logger.debug(`validateUser.ts-Password verification failed-${reason}`);

    return () => reason;
};

const makeUserDetailsFetcher = (logger: Logger) => (pool: DatabasePoolType) => (
    identifier: string,
) => {
    const sqlQuery = sql`
        SELECT id,password,firstname 
        FROM users 
        WHERE ${identifier}
    `;

    const onPoolConnection = async (conn: DatabasePoolConnectionType) =>
        await conn.maybeOne(sqlQuery);

    const x = () => pool.connect(onPoolConnection);

    return tryCatchK(x, makeDbErrLogger(logger));
};

// The function says it returns a string. Should return an option.
const determineIdentifier = (userIdentifier: Either<string, string>) => {
    const onEmailIdentifier = (email: string) => `email = ${email}`;
    const onUNameIdentifier = (username: string) =>
        `display_name = ${username}`;

    return foldEither(onEmailIdentifier, onUNameIdentifier)(userIdentifier);
};

const fetchUserDetails = (pool: DatabasePoolType, logger: Logger) => async (
    userIdentifier: Either<string, string>,
) => {
    const identifier = determineIdentifier(userIdentifier);
    const extractDetails = pick(['id', 'password', 'firstname']);

    const userDetailsFetcher = makeUserDetailsFetcher(logger)(pool);
    const userDetailsTE = userDetailsFetcher(identifier);

    const logDbErr = makeDbErrLogger(logger);
    const onDbFailure = flow(logDbErr, fromIO);

    const getUserDetails = foldTE(onDbFailure, extractDetails)(userDetailsTE());

    return getUserDetails().then(fromNullable);
};

export const createUserValidator = (
    pool: DatabasePoolType,
    logger: Logger,
) => async ({
    userIdentifier,
    providedPassword,
}: Arguments): Promise<Task<unknown>> => {
    const userDetails = await fetchUserDetails(pool, logger)(userIdentifier);

    const userDetailsTE = fromOption(() => null)(
        userDetails as Option<DBResults>,
    );

    const onPassValidationErr = flow(makeValidationErrLogger(logger), fromIO);

    const validatePassword = ({ password: hash }: DBResults) =>
        createPasswordValidator(log(logger, 'error'))(hash)(providedPassword);

    const extractNameAndId = pick(['firstname', 'id']);
    // TODO: Rename !
    const computation = chainFirst(validatePassword)(userDetailsTE);

    return foldTE(onPassValidationErr, extractNameAndId)(computation);
};
