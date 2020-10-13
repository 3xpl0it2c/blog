/*
This middleware logs every request made to the server.
For each request it logs:
1.The HTTP method (GET, POST, etc..).
2.The 'Referer' header (www.google.com).
3.The URL (for instance - /api/health/ok).

For each response it logs:
1.The HTTP method (From the request)
2.The URL. (From the request)
3.The response status code.
4.The length of the response.
*/

import { declareAppModule } from '@lib';
import { Context, Next } from 'koa';

const handler = async (ctx: Context, next: Next) => {
    const logger = ctx.logger.getLogger();
    const { method: httpMethod, headers, url: requestURL } = ctx.req;

    logger.info(`REQ ${httpMethod} ${requestURL} ${headers['user-agent']}`);

    // Now we log our response.
    await next();

    const { status, length } = ctx.response;
    logger.info(`RES ${httpMethod} ${requestURL} ${status} ${length}`);
    return ctx;
};

export default declareAppModule({
    httpMethod: 'ALL',
    path: 'ALL',
    handler,
});
