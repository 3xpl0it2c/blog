import { Logger } from 'log4js';
import { createPool, DatabaseConnectionType, sql } from 'slonik';

import { appConfiguration } from '../interfaces/appConfig';
import { Service } from '../interfaces/service';

const SERVICE_NAME = 'slonik';

const init = async (
    conf: appConfiguration,
    logger: Logger,
): Promise<DatabaseConnectionType | null> => {
    const { connectionURI } = conf.services.slonik;

    try {
        const pool = createPool(connectionURI);
        const testQuery = await pool.query(sql`SELECT 1 + 1 AS RESULT`);

        if (testQuery.rows[0].result === 2) {
            return pool;
        } else {
            throw new Error(
                `Test query failed !` +
                    `expected to receive one row and one column equal to 2 !` +
                    `Instead Received: ${testQuery}`,
            );
        }
    } catch (why) {
        logger.fatal(`Service ${SERVICE_NAME} failed to start !`);
        logger.debug(
            `Service ${SERVICE_NAME} failed to start because:\n ${why}`,
        );
    }

    return null;
};

export default {
    name: SERVICE_NAME,
    init,
} as Service;
