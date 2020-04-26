import { Context } from 'koa';
import { Package } from './package';
import { appConfiguration } from './appConfig';

export type Middleware = Pick<Package, 'path' | 'method'> & {
    handler: (config?: appConfiguration) =>
    (ctx: Context, next?: any) => Promise<void>;
};
