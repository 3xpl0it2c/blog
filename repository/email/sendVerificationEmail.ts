import { nanoid } from 'nanoid';
import { Transporter } from 'nodemailer';
import { Logger } from 'log4js';

export const verifyEmail = (emailAddress: string, messageOptions?: any) => async (
    mailTransport: Transporter,
    logger: Logger,
) => {
    try {
        const messageConfig =
    } catch (why) {}

};
