import { declareAppModule } from '@lib';

import {
    middleConf,
    MiddlewareModule,
    MountableModule,
} from '@interfaces';

export const declareMiddleware = (middleware: MiddlewareModule) => (
    c: middleConf,
): MountableModule => {
    const handler = middleware.handler(c);

    return declareAppModule({
        path: middleware.path,
        httpMethod: middleware.httpMethod,
        handler,
    });
};
