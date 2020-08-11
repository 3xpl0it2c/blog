import { loggerConf } from './loggerConfig';
import { slonikConf } from './slonikConfig';
import { redisConf } from './redisConfig';
import { emailConf } from './emailConfig';

export type servicesConfig = {
    logger: loggerConf;
    slonik: slonikConf;
    redis: redisConf;
    mailer: emailConf;
};
