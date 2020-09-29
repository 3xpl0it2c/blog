/**
 * @desc FP approach to the try-catch statement
 * @param {any} unsafe - the function to test
 * @param {function} onSuccess - a function that receives the computation result
 * @param {function} onError - a function which recieves the throw error object
 * */

export const tryCatch = <T = any | Error>(
    unsafe: () => T,
    onSuccess: (x: T) => any,
    onError: (e: Error) => any,
): any => {
    try {
        const result = unsafe();
        return onSuccess(result);
    } catch (why) {
        return onError(why);
    }
};
