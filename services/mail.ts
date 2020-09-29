import { Service, appConfiguration } from '@interfaces';
import { createTransport } from 'nodemailer';

const SERVICE_NAME = 'mail';

const init = async (appConf: appConfiguration) => {
    const trasportConfig = appConf.services.mailer;

    const transporter = createTransport(trasportConfig);

    return transporter;
};

export default {
    name: SERVICE_NAME,
    init,
} as Service;
