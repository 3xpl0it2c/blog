import { Configuration as loggerConf } from 'log4js';
import { ClientConfigurationType } from 'slonik';

export type slonikConf = {
    connectionURI: string;
    clientConfig?: ClientConfigurationType;
};

export type serverConfig = {
    host: string;
    port: number;
};

export type servicesConfig = {
    logger: loggerConf;
    slonik: slonikConf;
};

export type middlewareConfig = {};

export type appConfiguration = {
    name: string;
    server: serverConfig;
    services: servicesConfig;
    middleware?: middlewareConfig;
};
