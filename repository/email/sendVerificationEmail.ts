import { nanoid } from 'nanoid';
import { Transporter } from 'nodemailer';
import { Logger } from 'log4js';
import { MailOptions } from 'nodemailer/lib/json-transport';

export const verifyEmail = (
    emailAddress: string,
    messageOptions?: MailOptions,
) => async (
    mailTransport: Transporter,
    logger: Logger,
): Promise<boolean> => {
    const message: MailOptions = {
        to: emailAddress,
        ...messageOptions,
    };

    const onSuccess = (): boolean => true;
    const onError = (why: any): boolean => {
        logger.error(`Failed to send verification email`);
        logger.debug(
            `sendVerificationEmail.ts-Failed to send verification mail-${why}`,
        );

        return false;
    };

    return mailTransport
        .sendMail(message)
        .then(onSuccess)
        .catch(onError);
};
