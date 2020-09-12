import { sql, DatabasePoolType } from 'slonik';
import { Logger } from 'log4js';
import { pick } from '@lib';
/**
 * @desc Receives a verification token and sets the user as verified.
 * @param {string} token - the key by which the user is found.
 * @returns string -
 */
export const markUserAsValid = (token: string) => async (
    logger: Logger,
    slonik: DatabasePoolType,
): Promise<[ string, string ]> => {
    if (!token) return ['', ''];

    try {
        const result = await slonik.connect(async (pool) => {
            return await pool.maybeOne(sql`
                            UPDATE users
                            SET valid = true
                            WHERE token = ${token};
                            RETURNING firstname,id
                            `);
        });

        const { firstname, id, __missing } = pick([
            'firstname',
            'id',
        ])(result);

        return !!__missing
            ? [id, firstname]
            : ['', ''];
    } catch (why) {
        return ['', ''];
    }
};
