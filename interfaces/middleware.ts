import { Context } from 'koa';
import { Package } from './package';
import { MountableParams } from './MountableParams';

export type Middleware = Pick<Package, 'path' | 'method'> & {
    handler: (x: MountableParams) =>
    (ctx: Context, next?: any) => Promise<void>;
};
