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
export type logFunction<T> = (s: string) => Identity<T> | ((val: T) => string);

/*
 * @desc Takes a value and a message, logs the message and returns the value.
 * */
export const log = <T>(
    logger: Logger,
    level: loggerLevel,
): logFunction<T> => (
    message: string,
): (Identity<T> | ((val: T) => string)) =>
    (value: T) => (logger[level](message), value ?? message);

