import { Context } from 'koa';
import { default as Joi } from '@hapi/joi';
import { declareAppModule, genToken, httpError } from '@lib';
import { validateUser, genRefreshToken } from '@repository';


const successfulResponse = (
    ctx: Context,
    jwt: unknown,
    username: string, refreshToken: string,
) => {
    ctx.response.status = 200;
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
            httpError(ctx, 'invalid credentials', 406);
        }
    } catch (why) {
        // Switch on the error type and log accordingly.
        // Do not forget to respond accordingly.
    }
};


declareAppModule({
    path: '/login',
    httpMethod: 'POST',
    handler,
});
