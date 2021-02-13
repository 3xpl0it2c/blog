/*
   Upon receiving a POST to the /user/login path,
   This function should:
   1.Receive the user-name XOR email and password.
   2.Validate the given credentials via a Joi Schema

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
import { left, right, fold, fromPredicate } from 'fp-ts/Either';
import {
    tryCatchK,
    chain,
    bindTo,
    getOrElse,
    TaskEither,
} from 'fp-ts/TaskEither';
import { createUserValidator, genRefreshToken } from '@repository';
import { HttpStatusCodes } from '@interfaces';
import { declareAppModule, httpError, log, compose, assign } from '@lib';
import { pipe, Predicate } from 'fp-ts/lib/function';

const VALIDATED_USER = (id: string) => `Validated user ${id}`;
const ERROR_VALIDATING_USER = `Error validating user`;
const HTTP_ERROR_MESSAGE = 'Invalid login Parameters';
const INTERNAL_SCHEMA_VALIDATION_ERROR_MESSAGE = (e: unknown) =>
    `Failed verifying given login schema:${e}`;

const INTERNAL_ERR_VALIDATING_USER = (e: string) =>
    `Failed to verify user because ${e}`;

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

const onSchemaError = (context: Context) => (validationError: unknown) => {
    httpError(context, HTTP_ERROR_MESSAGE, HttpStatusCodes.BAD_REQUEST);
    return INTERNAL_SCHEMA_VALIDATION_ERROR_MESSAGE(validationError);
};

const handler = async (ctx: Context, next: Next) => {
    // There might loggers and token parsers, wait for them.
    await next();

    const logDebug = log(ctx.logger, 'debug');
    const logGeneral = log(ctx.logger, 'log');
    const logError = log(ctx.logger, 'error');

    // This is here since we need to access the context.
    const INTERNAL_SERVER_ERR_HTTP = httpError(
        ctx,
        'Internal Server Error',
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );

    const validateAgainstSchema = tryCatchK(
        joiSchema.validateAsync,
        onSchemaError(ctx),
    );

    const validatedQueryTE = validateAgainstSchema(ctx.query);
    const validateUser = createUserValidator(ctx.slonik, ctx.logger);

    const mapQueryToValidation = (x: {
        password: string;
        email: string;
        username: string;
    }) => {
        const { password, email, username } = x;
        const userIdentifier = !!username ? right(username) : left(email);

        return tryCatchK(
            validateUser,
            (_) => `${_}`,
        )({
            providedPassword: password,
            userIdentifier,
        });
    };

    const userDetails = await chain(mapQueryToValidation)(validatedQueryTE)();

    const successfulUserValidation = (results: {
        firstname: string;
        id: string;
    }) => {
        const { id, firstname } = results;
        const idAfterLog = compose(id, logGeneral(VALIDATED_USER(id)));

        const JWT: TaskEither<unknown, { JWT: unknown }> = await pipe(
            ctx.state.genJWT(id),
            bindTo('jwt'),
            getOrElse(() => of({})),
        )();

        const refreshToken = await pipe(
            genRefreshToken(ctx.redis, ctx.logger),
            bindTo('refreshToken'),
            getOrElse(() => of({})),
        )();

        const finalResult = assign(JWT)(refreshToken);
        const x: Predicate<any> = (z: any) => !!z.JWT && !!z.refreshToken;
        const safeResult = fromPredicate(x, () =>
            httpError(
                ctx,
                'Internal Server Error',
                HttpStatusCodes.INTERNAL_SERVER_ERROR,
            ),
        )(finalResult);

        return '';
    };

    /*
    if (!!userId) {
        // Migrate genRefreshToken to send a TaskEither,
        // Then Chain JWT & Refresh token with a Monad.

            ? successfulResponse(ctx, JWT, userFirstName, refreshToken)
            : httpError(
                ctx,
                'Internal Server Error',
                HttpStatusCodes.INTERNAL_SERVER_ERROR,
            );
    } else {
        httpError(ctx, HTTP_ERROR_MESSAGE, HttpStatusCodes.BAD_REQUEST);
    } */

    return fold(
        (error: string) => logDebug(INTERNAL_ERR_VALIDATING_USER(error))(error),
        successfulUserValidation,
    )(userDetails);
};

export default declareAppModule({
    path: '/user/login',
    httpMethod: 'POST',
    handler,
});
