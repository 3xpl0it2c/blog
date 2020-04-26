import { appConfiguration } from './appConfig';
import { Log4js } from 'log4js';

export type Service = {
    name: string;
    init: (conf: appConfiguration, log4js: Log4js) => any | Promise<any>;
};
