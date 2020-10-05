import { sendMail } from './sendMail';
import { SendMailOptions, Transporter } from 'nodemailer';
import { Logger } from 'log4js';

const verificationLink = (verificationToken: string) =>
    `https://mywebsitename.com/api/email/verify?token=${verificationToken}`;

// ? Should move to another, separate file (maybe even with ejs ?)
const template = (userName: string) => (verificationToken: string) => `
        <html>
            <body>
                <h1>Hello ${userName}, it seems like you tried to register with this email address</h1>
                <p>
                    You can click <a href="${verificationLink(
        verificationToken,
    )}" >here</a> in order to verify your email.<br />
                    Or, you just use this link if that does not work for you:<br/>
                    ${verificationLink(verificationToken)}
                </p>
            </body>
        </html>
`;

export const sendVerificationEmail = (
    to: string,
    userName: string,
    verificationToken: string,
    websiteName: string,
    options: SendMailOptions,
) => (transport: Transporter, logger: Logger): Promise<any> => {
    const messageTitle = `${websiteName} - Verify Your Email Address`;
    const html = template(userName)(verificationToken);

    const mailOptions = {
        subject: messageTitle,
        html,
        ...options,
    };

    return sendMail(to, mailOptions)(transport, logger);
};
