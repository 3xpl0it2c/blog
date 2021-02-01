import { createPasswordValidator, pick, log } from '@lib';
import { tryCatchK, fold, getOrElse, TaskEither } from 'fp-ts/TaskEither';
import { fromIO } from 'fp-ts/Task';
import { pipe } from 'fp-ts/pipeable';
import { IO } from 'fp-ts/IO';
import { Logger } from 'log4js';
import {
    DatabasePoolType,
    DatabaseConnectionType,
    DataIntegrityError,
    sql,
} from 'slonik';

const logDbError = (logger: Logger) => (why: Error): IO<void> => {
    switch (true) {
    case why instanceof DataIntegrityError:
        logger.warn(`Failed to locate user in database`);
        logger.error(
            `validateUser.ts-multiplie rows for one user-${why}`,
        );
        break;
    case why instanceof Error:
        logger.error(`Unknown Error while validating`);
        logger.debug(`validateUser.ts-Unknown error-${why}`);
    }

    return () => undefined;
};

const logValidationError = (logger: Logger) => (reason: unknown): IO<boolean> => {
    logger.error(`Failed to verify user via password`);
    logger.debug(`validateUser.ts-Password verification failed-${reason}`);

    return () => false;
};

const getUserDetails = (logger: Logger) => (pool: DatabasePoolType) => (identifier: string) => {
    const sqlQuery = sql`
        SELECT id,password,firstname 
        FROM users 
        WHERE ${identifier}
    `;

    const onPoolConnection = async (
        conn: DatabaseConnectionType,
    ) => await conn.maybeOne(sqlQuery);

    return tryCatchK(
        pool.connect(onPoolConnection),
        logDbError(logger),
    );
};

function contramap<A, B, C>(fab: (A) => B, fbc: (B) => C) {
    return (args: A) => fbc(fab(args));
}

export const createUserValidator = (
    pool: DatabasePoolType,
    logger: Logger,
) => async ({
    userName,
    email,
    userPassword,
}: {userName: string, email: string, userPassword: string}) => {
    const byEmail = sql`email=${email}`;
    const byUserName = sql`displayname=${userName}`;
    const identifier = userName ? byUserName : byEmail;

    const extractDetails = pick([
        'id',
        'password',
        'firstname',
    ]);

    const userDetailsTE = getUserDetails(logger)(pool)(identifier);

    const userDetails = fold(
        logDbError(logger),
        extractDetails,
    )(userDetailsTE);

    const validatePass = createPasswordValidator(
        log(logger, 'error'),
    )(userDetails.password);


    return chain();
};

