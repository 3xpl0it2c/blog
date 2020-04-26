import * as Koa from 'koa';

export type Package = {
    path: string;
    method: 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'ALL';
    handler: (resources: any) => Koa<any, any>;
};
