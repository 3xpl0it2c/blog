import { hash } from 'argon2';
import { Logger } from 'log4js';

/**
 * @desc Hashes a given string using argon2.
 * @param string password - What string to hash
 * @param logger logger - Log4js instance, available usually via koa`s context.
 */
export const hashPassword = async (
    password: string,
    logger: Logger,
): Promise<string> => {
    if (!password || !logger) return '';

    try {
        const hashedPass = await hash(password);

        logger.info(`Successfully hashed password`);

        return hashedPass;
    } catch (why) {
        logger.error(
            `Failed to generate hashed password-${why}`,
        );

        return '';
    }
};
