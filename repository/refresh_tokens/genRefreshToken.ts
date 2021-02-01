import { nanoid } from 'nanoid/async';
import { Either } from 'fp-ts/Either';
import { tryCatchK } from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/pipeable';
import ms from 'ms';
import * as Redis from 'ioredis';
import { Logger } from 'log4js';
import { log, compose } from '@lib';

const TOKEN_LIFE_DURATION = ms('15 minutes');
const BAD_ANSWER = '';

const main = (
    redis: Redis.Redis,
    logger: Logger
): Promise<Either<any, unknown>> => {
    const logDebug = log(logger, 'debug');
    const logError = log(logger, 'error');

    const onNanoIDFail = (reason: unknown) => {
        logError(`Failed generating random UUID: ${reason}`);
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

    const randomUUID = tryCatchK(
        nanoid(),
        onNanoIDFail,
    );

    // Set a refresh token that -
    // Will remove itself in TOKEN_LIFE_DURATION milliseconds.
    const setTaskEither = (uuid: string) => tryCatchK(
        redis.set(uuid, '', 'PX', TOKEN_LIFE_DURATION, 'NX'),
        onRedisFailure,
    );

    return pipe(
        randomUUID,
        setTaskEither,
    );
};

export const genRefreshToken = main;
