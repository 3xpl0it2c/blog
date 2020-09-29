/*
 * This middleware's purpose is to detect JWT tokens.
 * It does so by reading the Authorization header
 * After that - it injects the detected user id into app.context.state.user.
 * So that functions are able to dictate whether we have a logged-in user.
 * */

import { declareAppModule } from '@lib';
import { verify } from 'jsonwebtoken';

import { Context, Next } from 'koa';

const handler = async (ctx: Context, next?: Next) => {
    
};

export default declareAppModule({
    path: '*',
    handler,
    httpMethod: 'ALL',
});
