import { verify } from 'argon2';

/*
 * This function exists in order to reduce code repetition
 * It wraps the error inside a try catch so that you don't have to write one,
 * And in case you forget to write one, the whole program won't crash.
 * */
export const verifyPassword = async (
    hash: string,
    toCompare: string,
): Promise<[boolean, string]> => {
    // Although we enforced the arguments no to be empty,
    // Typescript does not enforce typing at runtime.
    if (hash === '' || toCompare === '') return [false, ''];

    try {
        const match = await verify(hash, toCompare);

        return [match, ''];
    } catch (why) {
        return [false, why];
    }
};
