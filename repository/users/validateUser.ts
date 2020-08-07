import { DatabasePoolType, sql } from 'slonik';
import { verifyPassword } from '@lib';
import { Logger } from 'log4js';

export const validateUser = (
    userName: string,
    email: string,
    userPassword: string,
) => async (pool: DatabasePoolType, logger: Logger): Promise<string> => {
    return pool.connect(async (conn) => {
        try {
            const byEmail = sql`email=${email}`;
            const byUserName = sql`displayname=${userName}`;
            const identifier = userName ? byUserName : byEmail;
            const result: any = await conn.maybeOne(sql`
                                                    SELECT id,password,firstname
                                                    FROM users 
                                                    WHERE ${identifier}
                                                    `);
            const { id, password, firstname } = result.rows[0];
            const [ok, why] = await verifyPassword(password, userPassword);

            if (why) {
                const now = new Date();
                logger.error(
                    `${now}-Failed to verify hashed password for user ${id}`,
                );
                logger.debug(
                    `${now}\n` +
                    `Failed to verify hashed password !\n` +
                    `Password from db: ${password}\n` +
                    `User provided password: ${userPassword}\n` +
                    `User name: ${userName}\n` +
                    `User ID: ${id}\n` +
                    `Library error: ${why}\n`,
                );
            }

            return ok
                ? `${id}:${firstname}`
                : '';
        } catch (why) {
            logger.error(`${new Date()}-Failed to execute SQL query-${why}`);
            logger.debug(
                `${new Date()}\n` +
                `Failed to retrieve uid, password and salt from database.\n` +
                `Given userName: ${userName}\n` +
                `Library error: ${why}\n`,
            );
            return '';
        }
    });
};
