import { default as Redis } from 'ioredis';
import { Service, appConfiguration } from '@interfaces';
import { Logger } from 'log4js';

const SERVICE_NAME = 'redis';

const init = async (appConf: appConfiguration, logger: Logger) => {
    const serviceConf = appConf.services.redis;

    try {
        const redisInstance = serviceConf.clientConfig
            ? new Redis(serviceConf.clientConfig)
            : new Redis(serviceConf.connectionURI);

        logger.log(`Initialized connection to redis at ${new Date()}`);

        return redisInstance;
    } catch (why) {
        logger.debug(
            `Failed to connect to redis because: \n${why}\n` +
                `Used configuration: ${serviceConf}`,
        );
    }
};

export default {
    name: SERVICE_NAME,
    init,
} as Service;
