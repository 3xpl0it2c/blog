import { Identity } from '@interfaces';
/* eslint-disable indent */
import { Logger } from 'log4js';

type loggerLevel =
    | 'fatal'
    | 'error'
    | 'warn'
    | 'log'
    | 'info'
    | 'debug'
    | 'trace';


// We Either return an identity or return the log message back.
export type logFunction<T> = (s: string) => Identity<T>;

/*
 * @desc Takes a value and a message, logs the message and returns an identity.
 * */
export const log = (
    logger: Logger,
    level: loggerLevel,
)=> (
    message: string,
) => <T>(value: T): T => (logger[level](message), value);
