import { promisify } from 'util';
import { compose } from '@lib';
import { tryCatchK, left, ap, of, TaskEither } from 'fp-ts/TaskEither';
import { sign } from 'jsonwebtoken';

import { Identity } from '@interfaces';

const signToken = promisify(sign);
/**
 @desc generates a JWT and logs either the success or the failure in doing so.
 @param userId {string} - the userId to sign into the token
 @param secret {string|buffer} - the secret with which the token is signed
 @param logDebug - see lib/log.ts
 @param logInfo - see lib/log.ts
 @param logError - see lib/log.ts
 @return {TaskEither} a TaskEither containing an error message or a token.
 */
export function genToken(
    userId: string,
    secret: Buffer | string,
    logDebug: (s: string) => Identity<any>,
    logInfo: (s: string) => Identity<any>,
    logError: (s: string) => Identity<any>,
): TaskEither<unknown, unknown> {
    const onError = <A>(e: A): A => {
        return compose(
            e,
            logError('JWT GENERATE ERROR'),
            logDebug(
                `Failed to generate JWT.\nBecause: ${e}`,
            ),
        );
    };

    const onSuccess = <B>(e: B): B => {
        return compose(
            e,
            logInfo('JWT GENERATED'),
            logDebug(
                `Generated JWT with UID: ${userId}.\nToken is:\n${token}`,
            ),
        );
    };

    const onSuccessEither = of(onSuccess);

    if (!userId) {
        return left('No user id was provided !');
    }

    const token = tryCatchK(
        ({userId, secret}) => signToken({ userId }, secret),
        onError,
    );

    return ap(token({ userId, secret }))(onSuccessEither);
}
