import { Context } from 'koa';
import * as Joi from '@hapi/joi';
import { declareAppModule } from '@lib';

/*
 * Get username and password from query parameters.
 * Look for them in database. If they match*/
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
                    .email({ minDomainSegments: 2})
    }).xor('email', 'username');

    try {
        const query = schema.validateAsync(ctx.query);
    } catch (why) {};
};


declareAppModule({
    path: '/login',
    httpMethod: 'POST',
    handler
});
