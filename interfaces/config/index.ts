import { servicesConfig } from './services';

export type serverConfig = {
    host: string;
    port: number;
    silent: boolean;
    keys: string[];
    proxy: boolean;
    env: string;
    subDomainOffset: string[];
};

// Currently we don't have any middleware yet,
// So the middleware config is just.. unknown.
export type middlewareConfig = Record<string, unknown>;

export type appConfiguration = {
    name: string;
    server: serverConfig;
    services: servicesConfig;
    middleware?: middlewareConfig;
};
