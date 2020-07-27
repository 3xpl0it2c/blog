import { nanoid } from 'nanoid';
import ms = require('ms');
import * as Redis from 'ioredis';
import { Logger } from 'log4js';


const expirationDate = ms('15 minutes');

const main = async (
    redis: Redis.Redis,
    logger: Logger,
    retry?: number,
): Promise<string> => {
    const randomUUID = nanoid();
    const isOk = await redis.set(randomUUID, '', 'PX', expirationDate, 'NX');

    if (isOk === 'OK') {
        logger.debug(`Successfully generated refresh token ${randomUUID}`);
        logger.log(`Generated refresh token`);
        return randomUUID;
    }

    switch (retry) {
    case undefined:
        logger.warn(`Failed to store refresh token, retrying again.`);
        return await main(redis, logger, 2);
    case 0:
        logger.error(`Failed to store refresh token after 3 tries.`);
        return '';
    default:
        logger.warn(`Failed to store refresh token, retrying again.`);
        return await main(redis, logger, retry - 1);
    }
};

export const genRefreshToken = main;
