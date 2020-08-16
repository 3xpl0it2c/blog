import { sql, DatabasePoolType } from 'slonik';
import { Logger } from 'log4js';

export const markUserAsValid = (token: string) => async (
    logger: Logger,
    slonik: DatabasePoolType,
) => {
    if (!token) return '';
    try {
        const result = slonik.connect(async (pool) => {
            return await pool.maybeOne(`
                            UPDATE users
                            SET valid = true
                            WHERE token = ${token};
                            RETURNING first_name,id
                            `);
        });
    } catch (why) {}
};
