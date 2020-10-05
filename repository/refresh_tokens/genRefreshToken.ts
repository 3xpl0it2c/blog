import { nanoid } from 'nanoid/async';
import ms from 'ms';
import * as Redis from 'ioredis';
import { Logger } from 'log4js';
import { responseOk, log, compose } from '@lib';

const expirationDate = ms('15 minutes');

const main = async (redis: Redis.Redis, logger: Logger): Promise<string> => {
    const logDebug = log(logger, 'debug');
    const logNormal = log(logger, 'log');
    const logFatal = log(logger, 'fatal');

    // We return an empty string on failure, never throw an error.
    const faultyResponse = '';
    const randomUUID = await nanoid();

    const onSuccess = (response: 'OK' | null) => {
        if (responseOk(response)) {
            const logMessage = `Generated refresh token`;
            const debugMessage =
                `Successfully generated refresh token ${randomUUID}`;

            return compose(
                randomUUID,
                logDebug(debugMessage),
                logNormal(logMessage),
            );
        } else {
            return faultyResponse;
        }
    };

    const onFailure = (why: Error) => {
        const debugMessage =
            `Failure inserting refresh token - redis issue: ${why}`;
        const fatalMessage = `Failed to communicate with Redis`;

        return compose(
            faultyResponse,
            logDebug(debugMessage),
            logFatal(fatalMessage),
        );
    };

    // Set a refresh token that -
    // Will remove itself in expirationDate milliseconds.
    return await redis
        .set(randomUUID, '', 'PX', expirationDate, 'NX')
        .then(onSuccess)
        .catch(onFailure);
};

export const genRefreshToken = main;
