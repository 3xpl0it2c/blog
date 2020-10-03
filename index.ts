/*

1.Load config.
2.Setup logger.
3.Init services.
4.Mount modules.
5.Listen.

*/

import { relative } from 'path';
import { default as Koa } from 'koa';
import { config as setupEnv } from 'dotenv';
import { configure, Log4js } from 'log4js';
import Router from 'koa-router';

import { default as loadConfig } from '@config';
import { compose, pick, assign, identity } from '@lib';
import services from '@services';
import { default as middlewares } from '@middleware';
import { default as funcs } from '@functions';
import { Service, appConfiguration } from '@interfaces';

const koaConfKeys = ['silent', 'subDomainOffset', 'keys', 'proxy', 'env'];

const extractKoaConf = pick(koaConfKeys);

const mountRouter = (router: Router) => (app: Koa): Koa<any, any> => {
    return app.use(router.routes()).use(router.allowedMethods());
};

const insertServices = (services: Record<any, unknown>) => (
    app: Koa<any, any>,
) => {
    return Object.keys(services).reduce((acc, key) => {
        Object.defineProperty(app.context, key, {
            get: () => services[key],
        });

        return acc;
    }, app);
};

const serviceInitiator = (configuration: appConfiguration, logger: Log4js) => {
    const onFailure = (name: string): string =>
        `Could not initiate service: ${name}`;
    const onSuccess = (name: string): string => `Initialized service ${name}`;
    const servicesLogger = logger.getLogger('services');
    const mainLogger = logger.getLogger('init');

    return async (service: Service) => {
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
    setupEnv();

    const koa = new Koa();
    const koaRouter = new Router();

    const configFolderPath = relative(__dirname, './config');

    // * Finished stage 1 (load config).
    const configuration = await loadConfig(
        process.env.NODE_ENV,
        true,
        configFolderPath,
    );

    const koaConf = extractKoaConf(configuration.server);

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
    const x = await Promise.all(servicesPromise);
    const initializedServices = x.reduce(
        (acc, current) => assign(current)(acc),
        Promise.resolve({ logger }),
    );

    // Finished stage 4 (Mount Modules)
    // All modules are declared with declareAppModule (lib folder)
    // Therefore all of them receive a router and give it back,
    // So it's safe to just use compose and be done with it.
    const router = compose(koaRouter, ...middlewares, ...funcs);

    const app = compose(
        koa,
        assign(koaConf),
        insertServices(initializedServices),
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
