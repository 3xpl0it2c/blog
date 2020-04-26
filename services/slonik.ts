import { Log4js } from 'log4js';
import { createPool, DatabaseConnectionType } from 'slonik';

import { appConfiguration } from '@interfaces/appConfig';
import { Service } from '@interfaces/service';

const init = async (
    conf: appConfiguration,
    logObj: Log4js,
): Promise<DatabaseConnectionType> => {
    const logger = logObj.getLogger('services');

    return 'Slonik Service';
};

export default {
    name: 'slonik',
    init,
} as Service;
