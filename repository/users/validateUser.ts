import { verifyPassword, pick, log } from '@lib';
import { tryCatchK, fold, TaskEither } from 'fp-ts/TaskEither';
import { fromIO } from 'fp-ts/Task';
import { IO } from 'fp-ts/IO';
import { Logger } from 'log4js';
import { DatabasePoolType, DataIntegrityError, sql } from 'slonik';

const logDbError = (logger: Logger) => (why: Error): IO<void> => {
    switch (true) {
    case why instanceof DataIntegrityError:
        logger.error(`Failed to locate user in database`);
        logger.debug(
            `validateUser.ts-multiplie rows for one user-${why}`,
        );
        break;
    case why instanceof Error:
        logger.error(`Unknown Error while validating`);
        logger.debug(`validateUser.ts-Unknown error-${why}`);
    }

    return () => undefined;
};

const logPassValidationError = (reason: unknown): IO<boolean> => {
    logger.error(`Failed to verify user-${id}`);
    logger.debug(`validateUser.ts-Password verification failed-${reason}`);

    return () => false;
};

export const createUserValidator = (
    pool: DatabasePoolType,
    logger: Logger,
) => async (
    userName: string,
    email: string,
    userPassword: string,
): Promise<[string, string]> => {
    const byEmail = sql`email=${email}`;
    const byUserName = sql`displayname=${userName}`;
    const identifier = userName ? byUserName : byEmail;

    try {
        const result = await pool.connect(async (conn) => {
            return await conn.maybeOne(sql`
                                        SELECT id,password,firstname
                                        FROM users 
                                        WHERE ${identifier}
                                        `);
        });

        const { id, password: dbPassHash, firstname } = pick([
            'id',
            'password',
            'firstname',
        ])(result);

        // Use a Monad, make result also a TaskEither.
        const validatePass = verifyPassword(log(logger, 'error'))(dbPassHash);
        const isPasswordOk = validatePass(userPassword);

        return await validatePassword() ? [id, firstname] : ['', ''];
    } catch (why) {
        logDbError(logger)(why);
        return ['', ''];
    }
};
