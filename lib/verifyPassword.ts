import { verify } from 'argon2';
import { tryCatchK, left, TaskEither } from 'fp-ts/TaskEither';
import { Identity } from '@interfaces';

/*
 * This function exists in order to reduce code repetition
 * It wraps the error inside a TaskEither so that you don't have to write one,
 * And in case you forget to write one, the whole program won't crash.
 * */
const main = (logError: (s: string) => Identity<any>) => (
    hash: string,
): ((s: string) => TaskEither<any, boolean>) => {
    // Although we enforced the arguments to never be empty,
    // Typescript does not enforce typing at runtime.
    if (hash === '') return () => left('No source hash provided');

    return tryCatchK(
        (toCompare: string) => verify(hash, toCompare),
        (s) => logError(`argon2 internal failure: ${s}`)(false),
    );
};

export const createPasswordValidator = main;
