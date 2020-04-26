import KoaRouter = require('koa-router');
import { Module } from './domain/module';

// TODO: Rethink about what happens here.
// It was a pain to write this, you shouldn't scratch your head a lot.
export default (...functions: Module[]): KoaRouter => {
    const router = new KoaRouter();

    const methods = {
        'GET': router.get,
        'POST': router.post,
        'PUT': router.put,
        'DELETE': router.delete,
        'OPTIONS': router.options,
        'ALL': router.all,
    };

    functions.forEach((module: Module): KoaRouter => {
        const { httpMethod, path, handler } = module;
        return methods[httpMethod](path, handler);
    });

    return router;
};
