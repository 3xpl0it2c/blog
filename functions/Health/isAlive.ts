/*
Upon a GET to /health/alive
This function should:

1.Send 'OK'.

*/

import { delcareAppModule } from '@lib';
import { HttpStatusCodes } from '@interfaces';
import { Context, Next } from 'koa';

const successfulResponse = (ctx: Context, message: string) => {
    ctx.status = HttpStatusCodes;
    ctx.body = {
        message,
    };

    return ctx;
};

const handler = async (ctx: Context, next: Next) => {
    await next();
    ctx.body = 'OK';
    return ctx;
}

export default delcareAppModule({
    path: '/health/alive',
    httpMethod: 'GET',
    handler,
});
