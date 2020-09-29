import { Logger } from 'log4js';

type loggerLevel =
    | 'fatal'
    | 'error'
    | 'warn'
    | 'log'
    | 'info'
    | 'debug'
    | 'trace';

/*
 * @desc Takes a value and a message, logs the message and returns the value.
 * */
export const log = (logger: Logger, level: loggerLevel) => (
    message: string,
) => <T = any>(value: T): T => {
    return logger[level](message), value;
};
