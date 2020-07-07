import { DatabasePoolType, sql } from 'slonik';
import { verify } from 'argon2';
import { Logger } from 'log4js';

const verifyPassword = async (hash: string, toCompare: string): Promise<[bool, string]> => {
    try {
        const match = await verify(hash, toCompare);

        return match
                ? [true, '']
                : [false, ''];
    } catch (why) {
        return [false, why];
    };
};

export const validateUserByName = (userName: string, userPassword: string) => async (pool: DatabasePoolType, logger: Logger): Promise<string> => {
    return pool.connect(async (conn) => {
        try {
            const result: any = await conn.maybeOne(sql`SELECT id,password,salt FROM users WHERE username=${userName}`);
            const { id, password, salt } = result.rows[0];
            const newPassword = `${salt}${userPassword}`;
            const [ ok, why ] = await verifyPassword(password, newPassword);

            if (why) {
                logger.error(`${new Date()}-Failed to verify hashed password for user id: ${id}`);
                logger.debug(
                    `${new Date()}\n` +
                    `Failed to verify hashed password !\n` +
                    `Password from db: ${password}\n` +
                    `Salt from db: ${salt}\n` +
                    `User provided password: ${userPassword}\n` +
                    `User name: ${userName}\n` +
                    `User ID: ${id}\n` +
                    `Library error: ${why}\n`
                );
            };

            return ok
                    ? id
                    : '';
        } catch (why) {
            logger.error(`${new Date()}-Failed to execute SQL query-${why}`);
            logger.debug(
                `${new Date()}\n` +
                `Failed to retrieve userid, password and salt from database.\n` +
                `Given userName: ${userName}\n` +
                `Library error: ${why}\n`
            );
            return '';
        }
    });
};
