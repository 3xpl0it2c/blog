import { Configuration as loggerConf } from 'log4js';
import { ClientConfigurationType as slonikClientConf} from 'slonik';
import { RedisOptions as redisClientConf } from 'ioredis';

export type slonikConf = {
    connectionURI: string;
    clientConfig?: slonikClientConf;
};

export type redisConf = {
    connectionURI: string;
    clientConfig?: redisClientConf;
};

export type serverConfig = {
    host: string;
    port: number;
};

export type servicesConfig = {
    logger: loggerConf;
    slonik: slonikConf;
    redis: redisConf;
};

export type middlewareConfig = Record<string, unknown>;

export type appConfiguration = {
    name: string;
    server: serverConfig;
    services: servicesConfig;
    middleware?: middlewareConfig;
};
