import { Context, Next } from 'koa';
import * as Router from 'koa-router';

export type Module = {
    path: 'ALL' | string;
    handler: (ctx: Context, next: Next) => any;
    httpMethod:
    | 'GET'
    | 'POST'
    | 'OPTIONS'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'HEAD'
    | 'ALL';
};

// This type is created by the declareAppModule helper
export type MountableModule = (router: Router) => Router;
