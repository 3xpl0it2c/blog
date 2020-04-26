/*
1.Load config.
2.Setup logger.
3.Init services.
4.Mount middelware.
5.Mount packages.
6.Listen.
*/

import { relative } from 'path';
import * as Koa from 'koa';
import { config as setupEnv } from 'dotenv';
import { configure } from 'log4js';
import Router from 'koa-router';

import { default as loadConfig } from './config';
import { default as services } from './services';
import { dummyExport as middlewares } from './middleware';
import { default as packages } from './packages';
import { Service, Middleware, Package } from './interfaces';

const createMounter = (router: Router) => (toMount: Package | Middleware) => (packageArgs: any): any => {
    const { method, path, handler } = toMount;

    const methods = {
        GET: router.get,
        POST: router.post,
        PUT: router.put,
        DELETE: router.delete,
        OPTIONS: router.options,
        ALL: router.all,
    };

    methods[method](path, handler(packageArgs));

    return createMounter(router);
};

const mountRouter = (router: Router) => (app: Koa): Koa<any, any> => {
    return app
        .use(router.routes())
        .use(router.allowedMethods());
};

const main = async (): Promise<any> => {
    // * Required by the 'useValueFromEnv' config hook.
    setupEnv();

    const koa = new Koa();
    const router = new Router();
    const mount = createMounter(router);

    const configFolderPath = relative(
        __dirname,
        './config',
    );

    // * Finished stage 1 (load config).
    const configuration = await loadConfig(
        process.env.NODE_ENV,
        true,
        configFolderPath,
    );
    // * Finished stage 2 (setup logger).
    const loggerObj = configure(
        configuration.services.logger,
    );

    // * Services log into a different category.
    // * Therefore we keep the original logger object.
    // (Instead of just calling getLogger directly)
    const logger = loggerObj.getLogger('init');

    /*
    * This object includes certain services that the packages require -
    * - In order to function properly.
    * Examples include a logger, a database client and so forth.
      The packages merge this object into their context,
      Therefore allowing their functions access to all they need.
    */
    // * Finished stage 3 (init services).
    const initializedServices = services.reduce(async (acc: any, service: Service) => {
        try {
            const serviceInstance = service.init instanceof Promise
                ? await service.init(configuration, loggerObj)
                : service.init(configuration, loggerObj);
            // TODO: FUCKING LOG ?!
            logger.info('');

            return Object.assign(acc, {
                [`${service.name}`]: serviceInstance,
            });
        } catch (e) {
            if (logger.isFatalEnabled) {
                // TODO: Better Error message.
                logger.fatal(`Failed to initialize service ${service.name} !`);
            }
        };
    }, { logger: loggerObj });

    // * Finished stage 4 (mount middleware).
    const withMiddleware = middlewares.reduce((mount: any, middleware: Middleware) => {
        return mount(middleware)(configuration);
    }, mount);

    // ? To be used later, in order to mount custom mounts and so forth.
    // * Finished stage 5 (mount packages).
    const withPackages = packages.reduce((mount: any, pkg: Package) => {
        return mount(pkg)({ resources: initializedServices });
    }, withMiddleware);

    const app = mountRouter(router)(koa);

    // * Finished stage 6 (listen).
    return (callback: () => void): void => {
        const { port, host } = configuration.server;
        app.listen(port, host, callback);
    };
};

const onSuccess = (): void => {
    console.log('App is up succesfully.');
};

const onError = (error: Error): never => {
    // I don't see any other fix.
    // If the app fails here (main func) then there is no fix for that.
    // ! Anything in there is crucial and should be stable like hell.
    throw error;
};

if (require.main === module) {
    main()
        .then((f) => f(onSuccess))
        .catch(onError);
}

export default main;
