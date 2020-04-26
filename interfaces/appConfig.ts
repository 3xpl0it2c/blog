import { Configuration as loggerConf } from 'log4js';

export type serverConfig = {
    host: string;
    port: number;
};

export type servicesConfig = {
    logger: loggerConf;
};

export type middlewareConfig = {};

export type appConfiguration = {
    name: string;
    server: serverConfig;
    services: servicesConfig;
    middleware?: middlewareConfig;
};
