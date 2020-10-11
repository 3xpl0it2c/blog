/*
Upon receiving a GET to the /api/user/search path,
This function should:
1.Verify if the asker is an authenticated user.
If not - Respond with an message indicating the asker is not authenticated.

*/

import { declareAppModule } from '@lib';
import { Next, Context } from 'koa';

const handler = async (ctx: Context, next: Next) => {
    await next();

    return ctx;
};

export default declareAppModule({
    httpMethod: 'GET',
    path: '/api/user/search',
    handler,
});
