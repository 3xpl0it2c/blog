/*
* Does not require authentication.

This function displays brief information about a user.
Only the name, uuid, bio and avatar photo link are sent.

Why do we need this ?
Not everyone has an account on our website,
So it is important to allow the public to view a little.
When reading an article, you might want to know who wrote that
And what does he look like ?

Where this request could fail ?
- No argument to look user by.
- Any other way of faulty input.

Steps for creation:
1.Parse the query object.

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
