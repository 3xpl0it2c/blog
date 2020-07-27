import { verify } from 'argon2';

/*
 * This function exists in order to reduce code repitition
 * It wraps the error inside a try catch so that you don't have to write one,
 * And in case you forget to write one, the whole program won't crash.
 * You're welcome ^_^
 * */
export const verifyPassword = async (hash: string, toCompare: string): Promise<[boolean, string]> => {
    if (hash === '' || toCompare === '') return [false , ''];

    try {
        const match = await verify(hash, toCompare);

        return match
                ? [true, '']
                : [false, ''];
    } catch (why) {
        return [false, why];
    };
};
