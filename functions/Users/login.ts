/*
Upon receiving a POST to the /user/login path,
This function should:
1.Receive the username XOR email and password.
2.Validate the schema and content using Joi.

If the credentials are empty or do not match the required schema:
    Respond with a 400.
    (Meaning the client didn't satisfy what was requested of him to send.)
Else:
    Validate credentials with database.

In case credentials match with db:
    Respond with jwt and user's name in body.
    Add Refresh token to the cookies.

In case credentials are incorrect:
    Respond with a 400
    In body say that credentials are incorrect.
*/

import { Context, Next } from 'koa';
import Joi from 'joi';

import { validateUser, genRefreshToken } from '@repository';
import { HttpStatusCodes } from '@interfaces';
import {
    declareAppModule,
    genToken,
    httpError,
    log,
} from '@lib';


const successfulResponse = (
    ctx: Context,
    jwt: unknown,
    username: string,
    refreshToken: string,
) => {
    ctx.body = {
        username,
        jwt,
    };

    ctx.cookies.set('refresh_token', refreshToken, ctx.cookieOptions);

    return ctx;
};

const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(20),
    password: Joi.string().min(8).max(24).required(),
    email: Joi.string().min(5).email(),
}).xor('email', 'username');

const handler = async (ctx: Context, next: Next) => {
    // There might loggers and token parsers, wait for them.
    await next();

    const logError = log(ctx.logger, 'error');
    const logInfo = log(ctx.logger, 'info');

    const query = await schema
        .validateAsync(ctx.query)
        .then((schema) => {
            const successfulMessage = 'Verified login schema successfully';
            return logInfo(successfulMessage)(schema);
        })
        .catch((why) => {
            const publicErrorMessage = 'Invalid login Parameters';
            const privateErrorMessage = 'Failed verifying given login schema';

            httpError(
                ctx,
                publicErrorMessage,
                HttpStatusCodes.BAD_REQUEST,
            );

            return logError(privateErrorMessage)(why);
        });

    if (query instanceof Error) {
        // We have inserted an error message already, stop here.
        return ctx;
    }

    const [userId, userFirstName] = await validateUser(
        query.username,
        query.email,
        query.password,
    )(ctx.slonik, ctx.logger);

    if (!!userId) {
        // ! TODO: Find a way to inject the secret from the app's context
        const jsonWebToken = genToken(userId, 'CUSTOM_SAUCE', ctx.logger);
        const refreshToken = await genRefreshToken(ctx.redis, ctx.logger);

        jsonWebToken && refreshToken
            ? successfulResponse(
                ctx,
                jsonWebToken,
                userFirstName,
                refreshToken,
            )
            : httpError(
                ctx,
                'Internal Server Error',
                HttpStatusCodes.INTERNAL_SERVER_ERROR,
            );
    } else {
        httpError(
            ctx,
            'Invalid login credentials',
            HttpStatusCodes.BAD_REQUEST,
        );
    }

    return ctx;
};

export default declareAppModule({
    path: '/user/login',
    httpMethod: 'POST',
    handler,
});
