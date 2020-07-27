import { Context } from 'koa';

export const httpError = (
    ctx: Context,
    error: string,
    statusCode: number,
): void => {
    ctx.status = statusCode;
    ctx.body = {
        error,
    };
};
