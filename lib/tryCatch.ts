/* eslint-disable require-jsdoc */
/**
 * @desc FP approach to the try-catch statement
 * @param {any} unsafe - the function to test
 * @param {function} onSuccess - a function that receives the computation result
 * @param {function} onError - a function which recieves the thrown error object
 * */

import { identity } from '@lib';

export const tryCatch = <T = any | Error>(
    unsafe: () => T,
    onSuccess: (x: T) => any,
    onError?: (e: Error) => any,
): any => {
    const right = onError ? onSuccess : identity;
    const left = onError ?? onSuccess;

    try {
        const result = unsafe();
        return right(result);
    } catch (why) {
        return left(why);
    }
};
