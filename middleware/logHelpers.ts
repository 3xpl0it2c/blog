import { log, declareMiddleware } from '@lib';
import { Context, Next } from 'koa';

/*
This middleware inserts common loggers into the context.
Saving the programmer the trouble of import lib/log.ts each time.
*/

const handler = () => async (ctx: Context, next: Next) => {
    const loggers = {
        logFatal: log(ctx.logger, 'fatal'),
        logError: log(ctx.logger, 'error'),
        logWarn: log(ctx.logger, 'warn'),
        logLog: log(ctx.logger, 'log'),
        logInfo: log(ctx.logger, 'info'),
        logDebug: log(ctx.logger, 'debug'),
    };

    ctx.state.loggers = loggers;

    return await next();
};

export default declareMiddleware({
    path: 'ALL',
    handler,
    httpMethod: 'ALL',
});
