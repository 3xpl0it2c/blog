/*
 * This middleware encapsulates the JWT master secret from functions.
 * It inserts a helper function that can generate JWTs.
 * Thus, functions need not access the JWT master secret,
 * But rather - call this helper.
 */

import { middleConf } from '@interfaces';
import { declareMiddleware, genToken, log } from '@lib';

import { Context, Next } from 'koa';

const handler = (config: middleConf) => async (ctx: Context, next: Next) => {
    const JWT_SECRET = config?.jwt.masterKey;
    const logError = log(ctx.logger, 'error');
    const logDebug = log(ctx.logger, 'debug');
    const logInfo = log(ctx.logger, 'info');

    /**
     @desc generates a JWT.
     @param data the data to insert into the token (token payload).
     @return returns a TaskEither containing an error or a token.
     */
    function generate(data: string) {
        return genToken(data, JWT_SECRET, logDebug, logError, logInfo);
    }

    ctx.state.genJWT = generate;

    return await next();
};

export default declareMiddleware({
    handler,
    path: 'ALL',
    httpMethod: 'ALL',
});
