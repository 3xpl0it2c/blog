import { servicesConfig } from './services';

export type serverConfig = {
    host: string;
    port: number;
};

export type middlewareConfig = Record<string, unknown>;

export type appConfiguration = {
    name: string;
    server: serverConfig;
    services: servicesConfig;
    middleware?: middlewareConfig;
};
