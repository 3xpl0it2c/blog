import { ClientConfigurationType as slonikClientConf } from 'slonik';

export type slonikConf = {
    connectionURI: string;
    clientConfig?: slonikClientConf;
};
