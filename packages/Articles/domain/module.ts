import { Context } from 'koa';

export type Module = {
    httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'ALL';
    path: string;
    handler: (ctx: Context, next?: () => Promise<unknown>) => void;
};
