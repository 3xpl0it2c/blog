import * as Redis from 'ioredis';
import { Logger } from 'log4js';
import { log } from '@lib';

const main = (redis: Redis.Redis, logger: Logger) => (
    async (refreshToken: string): Promise<string> => {
        if (!refreshToken) return '';

        const logInfo = log(logger, 'info');
        const logError = log(logger, 'error');

        const onSuccess = (response: string | null): string => {
            const successMessage = `successfully verified refresh token`;
            return logInfo(successMessage)(response ?? '');
        };

        const onError = (why: Error): string => {
            const errorMessage = `${why}`;
            return logError(errorMessage)('');
        };

        return await redis
            .get(refreshToken)
            .then(onSuccess)
            .catch(onError);
    }
);

export const verifyRefreshToken = main;
