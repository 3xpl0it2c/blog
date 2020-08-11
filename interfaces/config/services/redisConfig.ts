import { RedisOptions as redisClientConf } from 'ioredis';

export type redisConf = {
    connectionURI: string;
    clientConfig?: redisClientConf;
};

