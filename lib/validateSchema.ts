import { httpError } from '@lib';
import { HttpStatusCodes, Identity } from '@interfaces';

import { Schema } from '@hapi/joi';
import { Context } from 'koa';

export const schema = (schema: Schema, ctx: Context) => (
    onSuccess: string,
    onError: string,
    internalOnError: (e: Error) => string,
) => (
    logInfo: logFunc,
    logError: (s: string) => Identity<any>,
) => {
    return async (candidate: unknown): Promise<[boolean, any]> => {
        const errorHandler = (why: Error): [boolean, any] => {
            const newContext = httpError(
                ctx,
                onError,
                HttpStatusCodes.BAD_REQUEST,
            );
            const internalErr = internalOnError(why);
            const status = logError(internalErr)(false);

            return [status, newContext];
        };

        const successHandler = (result: any): [boolean, any] => {
            const status = logInfo(onSuccess)(true);
            return [status, result];
        };

        return await schema
            .validateAsync(candidate)
            .then(successHandler)
            .catch(errorHandler);
    };
};
