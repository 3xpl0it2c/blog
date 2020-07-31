import { hash } from 'argon2';
import { Logger } from 'log4js';

export const hashPassword = async (
    password: string,
    logger: Logger,
): Promise<string> => {
    try {
        const hashedPass = await hash(password);

        logger.info(`Successfuly hashed password-${new Date()}`);

        return hashedPass;
    } catch (why) {
        logger.info(
            `Failed to generate hashed password-${why}-${new Date()}`,
        );

        return '';
    }
};
