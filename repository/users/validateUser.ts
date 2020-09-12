import { verifyPassword, pick } from '@lib';
import { Logger } from 'log4js';
import { DatabasePoolType, DataIntegrityError, sql } from 'slonik';

export const validateUser = (
    userName: string,
    email: string,
    userPassword: string,
) => async (
    pool: DatabasePoolType,
    logger: Logger,
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

        const { id, password, firstname } = pick([
            'id',
            'password',
            'firstname',
        ])(result);

        const [ok, why] = await verifyPassword(password, userPassword);

        if (why) {
            logger.error(`Failed to verify user-${id}`);
            logger.debug(`validateUser.ts-Password verification failed-${why}`);
        }

        return ok ? [id, firstname] : ['', ''];
    } catch (why) {
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
        return ['', ''];
    }
};
