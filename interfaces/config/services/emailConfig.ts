import { ConnectionOptions } from 'tls';

type Authentication = {
    user: string;
    pass: string;
    type: 'login' | 'oauth2'
}

export type emailConf = {
    host: string;
    port: number;
    auth: Authentication;
    secure: boolean;
    tls: ConnectionOptions;
    requireTLS: boolean;
    pool: boolean;
};
