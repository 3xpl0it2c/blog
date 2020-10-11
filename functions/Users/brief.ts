/*
This function serves unauthenticated users.
For example, when viewing an article, you might not be authenticated,
But you still need to see the author's name and other creations of his.
This is the problem this function solves.
*/

import { declareAppModule } from '@lib';
import { Context, Next } from 'koa';

const handler = async (ctx: Context, next: Next) => {
    await next();
    return ctx;
};

export default declareAppModule({
    httpMethod: 'GET',
    path: '/api/user/brief',
    handler,
});
