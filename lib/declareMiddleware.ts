import { declareAppModule } from '@lib';

import {
    appConfiguration,
    MiddlewareModule,
    MountableModule,
} from '@interfaces';

export const declareMiddleware = (middleware: MiddlewareModule) => (
    c: appConfiguration,
): MountableModule => {
    const handler = middleware.handler(c);

    return declareAppModule({
        path: middleware.path,
        httpMethod: middleware.httpMethod,
        handler,
    });
};
