import { Context, Next } from 'koa';
import * as Router from 'koa-router';
import { middleConf } from '@interfaces';

export type HTTPMethod =
    | 'GET'
    | 'POST'
    | 'OPTIONS'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'HEAD'
    | 'ALL';

export type KoaHandler = (ctx: Context, next: Next) => any;
export type HTTPPath = 'ALL' | string;

export type Module = {
    path: HTTPPath;
    handler: KoaHandler;
    httpMethod: HTTPMethod;
};

export type MountableModule = (router: Router) => Router;

export type MiddlewareHandler = (c: middleConf) => KoaHandler;

export type MiddlewareModule = {
    path: HTTPPath;
    handler: MiddlewareHandler;
    httpMethod: HTTPMethod;
};

export type MountableMiddleware = (c: middleConf) => MountableModule;
