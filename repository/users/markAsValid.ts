/*
Receive a verification token,
Find the user associated with the token,
And mark the user as valid (e.g the user has verified his email address).
*/

import { sql, DatabasePoolType, DatabasePoolConnectionType } from 'slonik';
import { Logger } from 'log4js';
import { pick, log, compose } from '@lib';
import { fold } from 'fp-ts/Option';
import { of, Task } from 'fp-ts/Task';
import { tryCatchK, getOrElse } from 'fp-ts/TaskEither';
import {flow, pipe} from 'fp-ts/lib/function';
import {ConnectionRoutineType} from 'slonik/dist/types';

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
    if (!token) return ['', ''];

    const logInfo = log(logger, 'info');
    const logError = log(logger, 'error');

    const executeQuery = createMarkAsValidQuery(token);

    // ? Should this be a constant with CAPITAL LETTERS name ?
    const desiredPropsFromQuery = ['firstname', 'id'];
    const extractDesiredProps = pick(desiredPropsFromQuery);

    const onQuerySuccess = (
        results: Record<string, unknown>,
    ): [string, string] => {
        const logMessage = `marked user with token ${token} as valid`;

        const extractedProps = extractDesiredProps(results);
        const returnEmptyVal = (): [string, string] => ['', ''];
        const mapResultsToTuple = flow(
            mapIdAndNameToResult,
            logInfo(logMessage),
        );

        const x = fold(returnEmptyVal, mapResultsToTuple)(extractedProps);

        return x;
    };

    const onQueryError = (why: unknown): [string, string] => {
        const errorMessage = `Can\'t mark user as valid - ${why}`;

        return compose(
            ['', ''],
            logError(errorMessage),
        );
    };

    const dbQuery = tryCatchK(
        (a: ConnectionRoutineType<any>) => slonik.connect(a),
        onQueryError,
    )(executeQuery);

    const x = pipe(
        dbQuery,
        getOrElse((): Task<any> => of({})),
    );

    return await x()
        .then(onQuerySuccess);
};
