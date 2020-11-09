/*
 * This middleware's purpose is to detect JWT tokens.
 * It does so by reading the Authorization header
 * After that - it injects the detected user id into context.state.user.
 * So that functions are able to dictate whether we have a logged-in user.
 * */

import { promisify } from 'util';
import { verify } from 'jsonwebtoken';
import { Context, Next } from 'koa';
import { appConfiguration } from '@interfaces';
import { declareMiddleware } from '@lib';

const handler = (config: appConfiguration) => async (
    ctx: Context,
    next: Next,
) => {
    const verifyJWTPromise = promisify(verify);

    const secret = config.middleware?.jwt.masterKey;
    // TODO: Validate input.
    const token = ctx.headers['authorization'];

    const tokenPayload = await verifyJWTPromise(token, secret ?? '');

    ctx.state.user = tokenPayload ?? {};

    return await next();
};

export default declareMiddleware({
    path: '/',
    handler,
    httpMethod: 'ALL',
});
