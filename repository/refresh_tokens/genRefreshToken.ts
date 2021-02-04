import { nanoid } from 'nanoid/async';
import { tryCatchK, chain, TaskEither } from 'fp-ts/TaskEither';
import ms from 'ms';
import * as Redis from 'ioredis';
import { Logger } from 'log4js';
import { log, compose } from '@lib';

const TOKEN_LIFE_DURATION = ms('15 minutes');
const BAD_ANSWER = '';

const main = (
    redis: Redis.Redis,
    logger: Logger,
): TaskEither<any, unknown> => {
    const logDebug = log(logger, 'debug');
    const logError = log(logger, 'error');

    const onNanoIDFail = (reason: unknown) => {
        logError(`Failed generating random UUID: ${reason}`);
        return '';
    };

    const onRedisFailure = (why: unknown) => {
        const debugMessage =
            `Failure inserting refresh token - redis issue: ${why}`;
        const fatalMessage = `Failed to communicate with Redis`;

        return compose(
            BAD_ANSWER,
            logDebug(debugMessage),
            logError(fatalMessage),
        );
    };

    const genRandomUUID = tryCatchK(
        nanoid,
        onNanoIDFail,
    );

    // Set a refresh token that -
    // Will remove itself in TOKEN_LIFE_DURATION milliseconds.
    const setTaskEither = tryCatchK(
        (uuid: string) => redis.set(uuid, '', 'PX', TOKEN_LIFE_DURATION, 'NX'),
        onRedisFailure,
    );

    return chain(setTaskEither)(genRandomUUID());
};

export const genRefreshToken = main;
