import { Context } from 'koa';

export const httpError = (
    ctx: Context,
    error: string,
    statusCode: number,
): Context => {
    ctx.status = statusCode;
    ctx.body = {
        error,
    };

    return ctx;
};
