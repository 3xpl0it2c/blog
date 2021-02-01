/*
Upon receiving a POST to the /user/login path,
This function should:
1.Receive the user-name XOR email and password.
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
import { tryCatchK, fold, TaskEither } from 'fp-ts/TaskEither';
import { createUserValidator, genRefreshToken } from '@repository';
import { HttpStatusCodes } from '@interfaces';
import {
    declareAppModule,
    httpError,
} from '@lib';


const HTTP_ERROR_MESSAGE = 'Invalid login Parameters';
const INTERNAL_ERROR_MESSAGE = (e: unknown) =>
    `Failed verifying given login schema:${e.message}`;

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

const joiSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(20),
    password: Joi.string().min(8).max(24).required(),
    email: Joi.string().min(5).email(),
}).xor('email', 'username');

const onSchemaError = (context: Context) => (schemaValidationError: unknown) => {
    httpError(
        context,
        HTTP_ERROR_MESSAGE,
        HttpStatusCodes.BAD_REQUEST,
    );
    return INTERNAL_ERROR_MESSAGE(schemaValidationError);
};

const handler = async (ctx: Context, next: Next) => {
    // There might loggers and token parsers, wait for them.
    await next();

    const { logError, logInfo } = ctx.state.loggers;

    const validateSchema = tryCatchK(
        joiSchema.validateAsync,
        onSchemaError(ctx),
    );

    const query = validateSchema(ctx.query);
    const userValidator = createUserValidator(ctx.slonik, ctx.logger);
    // FIXME: Make createUserValidator use named parameters.
    const validateUserF = ({username, email, password}: any) =>
        userValidator(username, email, password);

    const validateUser = fold(
        () => Promise.resolve(['', '']),
        validateUserF,
    )(userValidator);

    if (!!query) {
        // We have inserted an error message already, stop here.
        return ctx;
    }

    const [userId, userFirstName] = await validateUser(query);

    if (!!userId) {
        // Migrate genRefreshToken to send a TaskEither,
        // Then Chain JWT & Refresh token with a Monad.
        const JWT: TaskEither<unknown, unknown> = ctx.state.genJWT(userId);
        const refreshToken = await genRefreshToken(ctx.redis, ctx.logger);

        JWT && refreshToken
            ? successfulResponse(
                ctx,
                JWT,
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
            HTTP_ERROR_MESSAGE,
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
