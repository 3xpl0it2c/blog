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
import { declareAppModule } from '@lib';
import {Context} from 'koa';
import * as Joi from '@hapi/joi';

const schema = Joi.object({
    name: Joi.string()
        .alphanum()
        .max(30)
        .min(3)
        .required(),
    lastName: Joi.string()
        .alphanum()
        .max(30)
        .min(2)
        .required(),
    email: Joi.string()
        .min(5)
        .email()
        .required(),
    password: Joi.string()
        .min(8)
        .max(24)
        .required(),
});

const handler = async (ctx: Context) => {
    try {
        const newUser = await schema.validateAsync(ctx.query);
    } catch (why) {}
};

export default declareAppModule({
    httpMethod: 'POST',
    path: '/user/signup',
    handler,
});

