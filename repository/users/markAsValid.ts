/*
Receive a verification token,
Find the user associated with the token,
And mark the user as valid (e.g the user has verified his email address).
*/

import { sql, DatabasePoolType, DatabasePoolConnectionType } from 'slonik';
import { Logger } from 'log4js';
import { pick, log, compose } from '@lib';

const createMarkAsValidQuery = (token: string) => async (
    pool: DatabasePoolConnectionType,
) => {
    const query = sql`
                        UPDATE users
                        SET valid = true
                        WHERE token = ${token};
                        RETURNING firstname,id
        `;

    return await pool.maybeOne(query);
};

const mapIdAndNameToResult = ({
    id,
    firstname,
}: Record<any, unknown>): [string, string] => [`${id}`, `${firstname}`];

/**
 * @desc Receives a verification token and sets the user as verified.
 * @param {string} token - the key by which the user is found.
 * @returns string - The user's id and his first name.
 */
export const markUserAsValid = (token: string) => async (
    logger: Logger,
    slonik: DatabasePoolType,
): Promise<[string, string]> => {
    // * Just return null on faulty input, don't throw an error.
    if (!token) return ['', ''];

    const logInfo = log(logger, 'info');
    const logError = log(logger, 'error');

    const executeQuery = createMarkAsValidQuery(token);

    // ? Should this be a constant with CAPITAL LETTERS name ?
    const desiredPropsFromQuery = ['firstname', 'id'];
    const extractDesiredProps = pick(desiredPropsFromQuery);

    const onQuerySuccess = (results: any): [string, string] => {
        const logMessage = `marked user with token ${token} as valid`;

        const extractedProps = compose(
            results,
            extractDesiredProps,
            logInfo(logMessage),
        );

        return extractedProps
            ? mapIdAndNameToResult(extractedProps)
            : ['', ''];
    };

    const onQueryError = (why: Error): [string, string] => {
        const errorMessage = `Can\'t mark user as valid - ${why}`;

        return compose(
            ['', ''],
            logError(errorMessage),
        );
    };

    return await slonik
        .connect(executeQuery)
        .then(onQuerySuccess)
        .catch(onQueryError);
};
