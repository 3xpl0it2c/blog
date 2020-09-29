import { Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { Logger } from 'log4js';
import { log } from '@lib';

// This code is designed awfuly.
// Needs attention.

export const sendMail = (
    emailAddress: string,
    messageOptions?: MailOptions,
) => async (mailTransport: Transporter, logger: Logger): Promise<any> => {
    const ON_SUCCESS_MSG = 'Successfuly sent mail to ${emailAddress}';
    const ON_FAILURE_MSG = 'Failed to email ${emailAddress}';

    const onError = log(logger, 'error')(ON_SUCCESS_MSG);
    const onSuccess = log(logger, 'info')(ON_FAILURE_MSG);

    // * Might need to declare a constat for the 'from' field.
    const message: MailOptions = {
        to: emailAddress,
        disableFileAccess: true,
        ...messageOptions,
    };

    return mailTransport
        .sendMail(message)
        .then(onSuccess)
        .catch(onError);
};

