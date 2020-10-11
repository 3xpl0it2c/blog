/*
Upon a GET to /health/alive
This function should:

1.Send 'OK'.

*/

import { declareAppModule } from '@lib';
import { HttpStatusCodes } from '@interfaces';
import { Context, Next } from 'koa';

const successfulResponse = (ctx: Context) => (message: string) => {
    ctx.status = HttpStatusCodes.SUCCESS;
    ctx.body = {
        message,
    };

    return ctx;
};

const handler = async (ctx: Context, next: Next) => {
    const okMessage = 'OK';

    await next();

    return successfulResponse(ctx)(okMessage);
};

export default declareAppModule({
    path: '/health/alive',
    httpMethod: 'GET',
    handler,
});
