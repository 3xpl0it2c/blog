import { Context, Next } from 'koa';
import * as Router from 'koa-router';

export type Module = {
    path: string;
    httpMethod: 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'ALL';
    handler: (ctx: Context, next?: Next) => any;
};

// This type is created by the declareAppModule helper
export type MountableModule = (router: Router) => Router;

