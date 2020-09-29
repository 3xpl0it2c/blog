/*
Upon receiving a POST to the /user/signup path
This function should:

1.Receive credentials required for sign up (See interfaces/User)
2.Validate the schema using Joi.

If the credentials are invalid:
    respond with a 400

If the credentials are partially invalid:
    respond with a 400
    Describe what field is incorrect

3.Use the repository to send a verification email
4.Use the repository to store the credentials, but set them to unverified.
(because the user did not verify his email yet)
*/

import { Context } from 'koa';
import { default as Joi } from '@hapi/joi';
import { nanoid } from 'nanoid/async';

import { HttpStatusCodes } from '@interfaces';
import { declareAppModule, log, compose } from '@lib';
import { writeUser, sendVerificationEmail } from '@repository';

const schema = Joi.object({
    name: Joi.string().alphanum().max(30).min(3).required(),
    lastName: Joi.string().alphanum().max(30).min(2).required(),
    email: Joi.string().min(5).email().required(),
    password: Joi.string().min(8).max(24).required(),
});

const response = (
    ctx: Context,
    message: string | boolean,
    httpStatusCode: number,
    errorMessage: string | null,
) => {
    ctx.status = httpStatusCode;
    ctx.body = {
        msg: message,
        err: errorMessage,
    };
};

const failedResponse = (
    ctx: Context,
    httpStatusCode: number,
    errorMessage: string,
) => {
    response(ctx, false, httpStatusCode, errorMessage);

    return errorMessage;
};

const succesfullResponse = (ctx: Context) => (userId: string): string => {
    response(ctx, userId, HttpStatusCodes.RESOURCE_CREATED, null);

    return userId;
};

const handler = async (ctx: Context) => {
    const logError = log(ctx.logger, 'error');
    const logInfo = log(ctx.logger, 'info');

    const newUser = await schema
        .validateAsync(ctx.query)
        .then((x) => x)
        .catch((why) => {
            const logErrMsg = `Blocked sign up attempt - bad schema - ${why}`;

            return logError(logErrMsg)(why);
        });

    if (!newUser) {
        const httpResponseErr = 'Schema mismatch';

        return failedResponse(
            ctx,
            HttpStatusCodes.BAD_REQUEST,
            httpResponseErr,
        );
    }

    const verificationToken = nanoid()
        .then((x) => x)
        .catch();

    // So I could compose() it.
    const writeUserWrap = async (emailVerificationToken: Promise<string>) =>
        await writeUser(newUser, await emailVerificationToken)(
            ctx.slonik,
            ctx.logger,
        );

    const verificationMailWrap = async (
        emailVerificationToken: Promise<string>,
    ) => {
        const { email, firstName } = newUser;

        sendVerificationEmail(
            email,
            firstName,
            await emailVerificationToken,
            ctx.app_name,
            {},
        )(ctx.mailer, ctx.logger)
            .then(() => {
                const logMessage = `Sent verification mail to ${email}`;

                return logInfo(logMessage);
            })
            .catch(logError);

        return emailVerificationToken;
    };

    const newUserId = await compose(
        verificationToken,
        verificationMailWrap,
        writeUserWrap,
    );

    if (newUserId) {
        const insertedUserMsg = `Inserted new user to db - id ${newUserId}`;

        compose(newUserId, logInfo(insertedUserMsg), succesfullResponse(ctx));
    } else {
        const failedInsertingUserMsg = 'Could not insert user';

        failedResponse(
            ctx,
            HttpStatusCodes.INTERNAL_SERVER_ERROR,
            failedInsertingUserMsg,
        );
    }

    return ctx;
};

export default declareAppModule({
    httpMethod: 'POST',
    path: '/user/signup',
    handler,
});
