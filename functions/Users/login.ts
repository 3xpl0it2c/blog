/*
Upon recieving a POST to the /login path,
This function should:
1.Recieve the username XOR email and password.
2.Validate the schema and content using Joi.

If the credentials are empty or do not match the required schema:
    Respond with a 406.
    (Meaning the client didn't satisfy what was requested of him to send.)
Else:
    Validate credentials with database.

In case credentials are correct:
    Respond with jwt and user's name in body.
    Add Refresh token to the cookies.
In case credentials are incorrect:
    Respond with a 400
    In body say that credentials are incorrect.
*/

import { Context } from 'koa';
import { default as Joi } from '@hapi/joi';
import { declareAppModule, genToken, httpError } from '@lib';
import { validateUser, genRefreshToken } from '@repository';


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
};

const handler = async (ctx: Context) => {
    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(20),
        password: Joi.string()
            .min(8)
            .max(24)
            .required(),
        email: Joi.string()
            .min(5)
            .email(),
    }).xor('email', 'username');

    try {
        const query = await schema.validateAsync(ctx.query);
        // returns either "id:name" or just "".
        const creds = await validateUser(
            query.username,
            query.email,
            query.password,
        )(ctx.slonik, ctx.logger);

        if (creds) {
            const [userId, name] = creds.split(':');
            const jsonWebToken = genToken(userId, 'CUSTOM_SAUCE', ctx.logger);
            const refreshToken = await genRefreshToken(ctx.redis, ctx.logger);

            (jsonWebToken && refreshToken)
                ? successfulResponse(ctx, jsonWebToken, name, refreshToken)
                : httpError(ctx, 'Internal Server Error', 501);
        } else {
            httpError(ctx, 'Invalid credentials', 406);
        }
    } catch (why) {
        const errMessage = 'Invalid Parameteres';
        httpError(ctx, errMessage, 400);
        ctx.logger.log(`${ctx.method}-${ctx.url}--${new Date()}`);
    }
};


declareAppModule({
    path: '/login',
    httpMethod: 'POST',
    handler,
});
