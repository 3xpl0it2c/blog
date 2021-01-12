/*
Upon receiving a GET to the /api/user/search path,
This function should:
1.Verify if the asker is an authenticated user.
If not - Respond with an message indicating the asker is not authenticated.
2.Redirect to the appropriate search route.
*/

import { declareAppModule, has } from '@lib';
import { sequenceT } from 'fp-ts/lib/Apply';
import { NonEmptyArray, getSemigroup } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/pipeable';
import {
    mapLeft,
    map,
    getValidation,
    right,
    left,
    Either,
} from 'fp-ts/lib/Either';

import { Next, Context } from 'koa';
import { HttpStatusCodes } from '@interfaces';

const lift = <E, A>(
    check: (a: A) => Either<E, A>,
): (a: A) => Either<NonEmptyArray<E>, A> => {
    return (a) =>
        pipe(
            check(a),
            mapLeft((a) => [a]),
        );
};

const searchMethods: Record<string, string> = {
    'name': '/api/user/search/name',
    'id': '/api/user/search/id',
    'email': '/api/user/search/email',
};

const invalidRequest = (ctx: Context) => (errors: string[]) => {
    ctx.status = HttpStatusCodes.BAD_REQUEST;
    ctx.body = {
        errors,
    };
};

const nonEmptyString = (target: string): Either<string, string> =>
    !target ? left('Empty Value') : right(target);

const searchMethodSupported = (target: string): Either<string, string> =>
    searchMethods[target] === undefined
        ? left('Unsupported search method')
        : right(target);

const nonEmptyStringValidation = lift(nonEmptyString);
const searchMethodSupportedValidation = lift(searchMethodSupported);

const StringApplicativeValidation = getValidation(getSemigroup<string>());

const validateQuery = (
    query: string,
): Either<NonEmptyArray<string>, string> => {
    return pipe(
        sequenceT(StringApplicativeValidation)(
            nonEmptyStringValidation(query),
        ),
        map(() => query),
    );
};

const validateSearchMethod = (
    searchMethod: string,
): Either<NonEmptyArray<string>, string> => {
    return pipe(
        sequenceT(StringApplicativeValidation)(
            nonEmptyStringValidation(searchMethod),
            searchMethodSupportedValidation(searchMethod),
        ),
        map(() => searchMethod),
    );
};

const handler = async (ctx: Context, next: Next) => {
    await next();

    const { by: searchMethod, query } = ctx.request.query;
    const safeQuery = validateQuery(query);
    const safeSearchMethod = validateSearchMethod(searchMethod);

    return ctx;
};

export default declareAppModule({
    httpMethod: 'GET',
    path: '/api/user/search',
    handler,
});
