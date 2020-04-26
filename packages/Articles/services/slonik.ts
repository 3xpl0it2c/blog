/*
Written by Nadav Raz. (A.K.A R991 | 3xpl0it2c)

This file is just a singleton.
It initiates the slonik connection pool and that's it.
*/

import { createPool,
    DatabaseConfigurationType,
    DatabasePoolConnectionType,
} from 'slonik';

let connectionHolder: any;

const connectionConfig: DatabaseConfigurationType = {};

export const getConnection = async (): Promise<DatabasePoolConnectionType> => {
    try {
        if (!connectionHolder) {
            connectionHolder = createPool(connectionConfig);
        };
    } catch (error) {
        connectionHolder = null;
        // TODO: log the error.
    } finally {
        return connectionHolder;
    }
};
