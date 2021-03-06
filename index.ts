/*

1.Load config.
2.Setup logger.
3.Init services.
4.Mount modules.
5.Listen.

*/

// * Resolves path aliases (@lib -> ../lib)
import 'module-alias/register';

import { resolve } from 'path';
import Koa from 'koa';
import { config as setupEnv } from 'dotenv';
import { configure, Log4js } from 'log4js';
import Router from 'koa-router';
import { getOrElse } from 'fp-ts/Option';

import loadConfig from '@config';
import { compose, pick, assign } from '@lib';
import services from '@services';
import middlewares from '@middleware';
import funcs from '@functions';
import { Service, appConfiguration } from '@interfaces';
import { pipe } from 'fp-ts/lib/function';

const koaConfKeys = ['silent', 'subDomainOffset', 'keys', 'proxy', 'env'];

const extractKoaConf = pick(koaConfKeys);

const insertKoaConf = (config: Record<any, string>) => (app: Koa<any, any>) => {
    const configKeys = Object.keys(config);

    const convertToGetter = (object: Record<any, any>) => {
        return (key: any) => ({ get: () => object[key] });
    };

    return configKeys.reduce((acc, key) => {
        // Insert to the app a certain key and it's associated value.
        // Somehow this only works with getters and Object.defineProperty.
        const keyToGetter = convertToGetter(config);
        Object.defineProperty(acc, key, keyToGetter(key));
        return acc;
    }, app);
};

const mountRouter = (router: Router) => (app: Koa): Koa<any, any> => {
    return app.use(router.routes()).use(router.allowedMethods());
};

const insertServices = (services: Record<any, any>) => (app: Koa<any, any>) => {
    return Object.keys(services).reduce((app, key) => {
        Object.defineProperty(app.context, key, services[key]);

        return app;
    }, app);
};

const serviceInitiator = (configuration: appConfiguration, logger: Log4js) => {
    const onFailure = (name: string): string =>
        `Could not initiate service: ${name}`;
    const onSuccess = (name: string): string => `Initialized service ${name}`;
    const servicesLogger = logger.getLogger('services');
    const mainLogger = logger.getLogger('init');

    return async (service: Service): Promise<any> => {
        const failMessage = onFailure(service.name);
        const successMessage = onSuccess(service.name);

        const serviceInstance =
            service.init instanceof Promise
                ? await service.init(configuration, servicesLogger)
                : service.init(configuration, servicesLogger);

        // If you can't connect to your database, what can you do exactly ?
        // Services are important, as much as the app itself.
        if (!serviceInstance) {
            mainLogger.fatal(failMessage);
            throw new Error(failMessage);
        }

        mainLogger.info(successMessage);

        return {
            [`${service.name}`]: serviceInstance,
        };
    };
};

const main = async (): Promise<any> => {
    // * Required by the 'useValueFromEnv' config hook.
    // * Loads all environment variables from a file named .env
    setupEnv();

    const koa = new Koa();
    const koaRouter = new Router();

    const configFolderPath = resolve(__dirname, './config');

    // * Finished stage 1 (load config).
    const configuration = await loadConfig(
        process.env.NODE_ENV,
        true,
        configFolderPath,
    );

    const koaConf = pipe(
        configuration.server,
        extractKoaConf,
        getOrElse(() => ({})),
    );

    // * Finished stage 2 (setup logger).
    const logger = configure(configuration.services.logger);

    // * Finished stage 3 (init services).
    /*
     * This object includes certain services that the functions require -
     * - In order to function properly.
     * Examples include a logger, a database client and so forth.
     */
    const initService = serviceInitiator(configuration, logger);
    const servicesPromise = services.map(initService);
    const initializedServices = await Promise.allSettled(servicesPromise);
    const servicesMap: Record<string, any> = initializedServices.reduce(
        (acc, current) => assign(current)(acc),
        { logger: { get: () => logger } },
    );

    // Stage 4 (Mount Modules)
    const initializedMiddleware = middlewares.map((middleware) =>
        middleware(configuration.middleware),
    );

    // All modules receive a router and give it back.
    // E.g -> They are chainable with compose.
    const router = compose(koaRouter, ...initializedMiddleware, ...funcs);

    const app = compose(
        koa,
        insertKoaConf(koaConf),
        insertServices(servicesMap),
        mountRouter(router),
    );

    // * Finished stage 6 (listen).
    return (callback: () => void): void => {
        const { port, host } = configuration.server;
        app.listen(port, host, callback);
    };
};

const onSuccess = (): void => {
    console.log('App is up successfully.');
};

const onError = (error: Error): never => {
    // I don't see any other fix.
    // If the app fails here (main func) then there is no fix for that.
    // ! Anything in there is crucial and should be stable.
    throw error;
};

// https://nodejs.org/api/modules.html#modules_accessing_the_main_module
if (require.main === module) {
    main()
        .then((f) => f(onSuccess))
        .catch(onError);
}

export default main;
