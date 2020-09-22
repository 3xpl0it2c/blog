import { nanoid } from 'nanoid';
import ms = require('ms');
import * as Redis from 'ioredis';
import { Logger } from 'log4js';
import { responseOk } from '@lib';

const expirationDate = ms('15 minutes');

const main = async (redis: Redis.Redis, logger: Logger): Promise<string> => {
    const randomUUID = nanoid();
    const isOk = await redis.set(randomUUID, '', 'PX', expirationDate, 'NX');

    if (responseOk(isOk)) {
        logger.debug(`Successfully generated refresh token ${randomUUID}`);
        logger.log(`Generated refresh token`);

        return randomUUID;
    }

    return '';
};

export const genRefreshToken = main;
