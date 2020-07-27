import { Context } from 'koa';
import { SetOption } from 'cookies';

export const setCookie = (key: string, val: string, opts?: SetOption) => {
    const defaults: SetOption = {};
    const options = opts
        ? opts
        : defaults;

    // If the key is empty we can't set the cookie, because it has no name.
    if (!key) throw new TypeError('parameter key must not be empty.');

    return (ctx: Context): void => {
        ctx.cookies.set(
            encodeURIComponent(key),
            encodeURIComponent(val),
            options,
        );
    };
};
