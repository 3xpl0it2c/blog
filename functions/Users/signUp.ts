import { declareAppModule } from '@lib';
import {Context} from 'koa';
import * as Joi from '@hapi/joi';

const handler = async (ctx: Context) => {
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

    try {
        const newUser = await schema.validateAsync(ctx.query);
    } catch (why) {}
};

export default declareAppModule({
    httpMethod: 'POST',
    path: '/user/signup',
    handler,
});

