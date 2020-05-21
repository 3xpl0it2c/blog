
import { hostname } from 'os';
import Koa = require('koa');
import * as Router from 'koa-router';
import { config as loadEnv } from 'dotenv';
import compose from '@lib/compose';
import { Package } from '@interfaces/index';
import { getLogger } from './services/logger';
import { default as functions } from './functions';
import { default as createRouter } from './router';

/*
  * Compose expects all the funcs to take a T and return a T.
  * That is why there is an 'any' included after the IRouterParam etc..
    injectRouterToKoa returns the 'KoaWithRouter' type instead.
    That type mismatches the default Koa type.
    (which leads to line 2 of this comment)
*/

// I still don't know what to do about it..
// This is why people dislike Typescript.
/* eslint-disable @typescript-eslint/indent */
type KoaWithRouter = Koa<
                    any,
                    Koa.DefaultContext
                    & Router.IRouterParamContext<any, {}>
                    | any>;
/* eslint-enable @typescript-eslint/indent */

const injectResourcesToKoa = (resources: any) => (app: Koa): Koa => {
    app.context = Object.assign(app.context, resources);
    return app;
};

const injectRouterToKoa = (router: Router) => (app: Koa): KoaWithRouter => {
    return app
        .use(router.routes())
        .use(router.allowedMethods());
};

const main = ({ resources }: any): Koa => {
    const app = new Koa();
    const router = createRouter(...functions);

    return compose(
        app,
        injectResourcesToKoa(resources),
        injectRouterToKoa(router),
    );
};

// https://nodejs.org/api/modules.html#modules_accessing_the_main_module
if (require.main === module) {
    loadEnv();

    const logger = getLogger(process.env.NODE_ENV);

    const config = {
        resources: {
            logger,
        },
    };

    const app = main(config);
    const port = process.env.NODE_PORT as any | 8080;
    // * I know this is unreadable.
    // * Typescript just can't accept anything else.
    const host = process.env.NODE_HOST as any | '' + (hostname());

    app.listen(port, host, () => {
        logger.info(`ON ${host}:${port}`);
        logger.debug(`${process.env.NODE_NAME} Server is up and running at http://${host}:${port}`);
    });
};

export const __package = {
    method: 'ALL',
    path: '/articles',
    handler: main,
} as Package;
