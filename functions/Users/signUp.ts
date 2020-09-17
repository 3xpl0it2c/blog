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
import { declareAppModule } from '@lib';
import { writeUser } from '@repository';

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

const succesfullResponse = (ctx: Context, userId: string) => {
    response(ctx, userId, HttpStatusCodes.RESOURCE_CREATED, null);
};

const handler = async (ctx: Context) => {
    try {
        const newUser = await schema.validateAsync(ctx.query);
        const verificationToken = await nanoid();

        const newUserId = await writeUser(newUser, verificationToken)(
            ctx.slonik,
            ctx.logger,
        );

        if (newUserId) {
            succesfullResponse(ctx, newUserId);
        } else {
            throw new Error();
        }
    } catch (why) {
        response(ctx, false, HttpStatusCodes.BAD_REQUEST, '');
    }
};

export default declareAppModule({
    httpMethod: 'POST',
    path: '/user/signup',
    handler,
});
