/*
Written by Nadav Raz. (A.K.A R991 | 3xpl0it2c)

This file contains the configuration for the logger used in this app.
Anything in here is merely a tiny singleton.
*/

import { configure, Configuration as logConfig } from 'log4js';

const loggerConfiguration: logConfig = {
    appenders: {
        console: {
            type: 'console',
        },
        files: {
            type: 'file',
            filename: '${process.env.NODE_NAME}.log',
            maxLogSize: 10485760,
            backups: 3,
            compress: true,
        },
    },
    categories: {
        'debugging': {
            appenders: ['console'],
            level: 'debug',
        },
        'development': {
            appenders: ['console'],
            level: 'debug',
        },
        'production': {
            appenders: ['console', 'files'],
            level: 'info',
        },
    },
};

const logger = configure(loggerConfiguration);

export const { getLogger } = logger;
