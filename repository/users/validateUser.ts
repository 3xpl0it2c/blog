import { createPasswordValidator, pick, log } from '@lib';
import { fold as foldEither, Either } from 'fp-ts/Either';
import { fromNullable, Option } from 'fp-ts/Option';
import { IO } from 'fp-ts/IO';
import { fromIO, of, ap, Task } from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/lib/function';
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
    TaskEither,
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

type FirstNameAndID = Pick<DBResults, 'firstname' | 'id'>;

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
): IO<any> => {
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

    return tryCatchK(pool.connect, makeDbErrLogger(logger))(onPoolConnection);
};

const determineIdentifier = (identifier: Either<string, string>): string => {
    const onEmailIdentifier = (email: string) => `email = ${email}`;
    const onUNameIdentifier = (username: string) =>
        `display_name = ${username}`;

    return foldEither(onEmailIdentifier, onUNameIdentifier)(identifier);
};

const fetchUserDetails = (pool: DatabasePoolType, logger: Logger) => (
    userIdentifier: Either<string, string>,
) => {
    const identifier = determineIdentifier(userIdentifier);
    const extractDetails = (...a: any[]) =>
        fromOption(() => null)(pick(['id', 'password', 'firstname'])(...a));

    const userDetailsFetcher = makeUserDetailsFetcher(logger)(pool);

    const logDbErr = makeDbErrLogger(logger);
    const onDbFailure = flow(logDbErr, fromIO);

    const getUserDetails = foldTE(
        onDbFailure,
        extractDetails,
    ) as () => Task<DBResults | null>;

    const taskFromNullable = of(fromNullable);

    return pipe(identifier, userDetailsFetcher, getUserDetails, (x) =>
        ap(x)(taskFromNullable),
    );
};

export const createUserValidator = (
    pool: DatabasePoolType,
    logger: Logger,
) => async ({
    userIdentifier,
    providedPassword,
}: Arguments): Promise<FirstNameAndID> => {
    const userDetails = fetchUserDetails(pool, logger)(userIdentifier);

    const userDetailsTE = fromOption(() => null)(
        (await userDetails()) as Option<DBResults>,
    );

    const onPassValidationErr = flow(makeValidationErrLogger(logger), fromIO);

    const extractNameAndId = (...a: any[]) =>
        fromOption(() => null)(pick(['firstname', 'id'])(...a));

    const validatePassword = ({ password: hash }: DBResults) =>
        createPasswordValidator(log(logger, 'error'))(hash)(providedPassword);

    const validatedUserDetails: TaskEither<null, DBResults> = chainFirst(
        validatePassword,
    )(userDetailsTE);

    return await foldTE(
        onPassValidationErr,
        extractNameAndId,
    )(validatedUserDetails)();
};
