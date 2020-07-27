import { sign } from 'jsonwebtoken';
import { Logger } from 'log4js';

export const genToken = async (
    userId: string,
    secret: Buffer | string,
    logger: Logger,
): Promise<unknown | string> => {
    try {
        if (!userId) {
            throw new Error('No userid was provided !');
        }

        const token = sign({ userId }, secret);

        logger.log(`Generated a jwt at ${new Date()}`);

        logger.debug(
            `Generated jwt with UID: ${userId}.\nToken is:\n${token}`,
        );

        return token;
    } catch (why) {
        logger.error(`Failed to generate JWT`);

        logger.debug(
            `Failed to generate JWT.\nBecause: ${why}`,
        );

        return '';
    }
};
