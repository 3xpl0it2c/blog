import { hash } from 'argon2';
import { Logger } from 'log4js';

export const hashPassword = async (
    password: string,
    logger: Logger,
): Promise<string> => {
    if (!password || !logger) return '';

    try {
        const hashedPass = await hash(password);

        logger.info(`Successfuly hashed password`);

        return hashedPass;
    } catch (why) {
        logger.error(
            `Failed to generate hashed password-${why}`,
        );

        return '';
    }
};
