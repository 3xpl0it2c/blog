import { Context, Next } from 'koa';
import * as Router from 'koa-router';
// import { appConfiguration } from '@interfaces';

// FIXME: You should not access files directly !
import { middlewareConfig } from './config/middleware';

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

export type MiddlewareModule = {
    path: HTTPPath;
    handler: (c: middlewareConfig) => KoaHandler;
    httpMethod: HTTPMethod;
};

export type MountableMiddleware = (c: middlewareConfig) => MountableModule;
