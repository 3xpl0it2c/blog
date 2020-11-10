import { servicesConfig } from './services';

import { middlewareConfig } from './middleware';

export type serverConfig = {
    host: string;
    port: number;
    silent: boolean;
    keys: string[];
    proxy: boolean;
    env: string;
    subDomainOffset: string[];
};

export type appConfiguration = {
    name: string;
    server: serverConfig;
    services: servicesConfig;
    middleware: middlewareConfig;
};
