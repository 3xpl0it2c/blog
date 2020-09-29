/*
TL;DR - Give this a string of some UUID/Random and an user object.

1.Receive a random token (user for verification) and a user object.
2.Hash the provided password/
3.Grab the current date in ISO format.
4.Insert all of this (user, hashed password, current date) into the db.
5.Return the id of the newly created user.

*/
import { User } from '@interfaces';
import { hashPassword } from '@lib';
import { Logger } from 'log4js';
import {
    DatabasePoolType,
    sql,
    DataIntegrityError,
    NotFoundError,
} from 'slonik';

export const writeUser = (user: User, verificationToken: string) => async (
    slonik: DatabasePoolType,
    logger: Logger,
): Promise<string> => {
    const { firstName, lastName, email, password } = user;
    const hashedPass = await hashPassword(password, logger);
    const now = new Date().toISOString();

    try {
        if (!hashedPass) throw new Error('Failed to hash password');

        const fields = sql.join(
            [firstName, lastName, email, hashedPass, now, verificationToken],
            sql`, `,
        );

        const { userId } = await slonik.connect((conn) => {
            return conn.one(sql`
                             INSERT INTO users
                             (
                                firstName,
                                lastName,
                                email,
                                password,
                                registration_date,
                                verify_token
                             )
                             VALUES (${fields})
                             RETURNING id AS userId;
                             `);
        });

        return userId;
    } catch (why) {
        switch (true) {
        case why instanceof DataIntegrityError:
            logger.error(`Integrity Error while creating user`);
            logger.debug(
                `writeUser.ts-INSERT resulted in multiple results-${why}`,
            );
            break;
        case why instanceof NotFoundError:
            logger.error(`Newly created user is not found`);
            logger.debug(
                `writeUser.ts-Did not receive inserted user id-${why}`,
            );
            break;
        case why instanceof Error:
            logger.error(`General Failure writing user`);
            logger.debug(`writeUser.ts-Unknown Error-${why}`);
            break;
        default:
            break;
        }

        // Returning an empty string indicates that there was a failure.
        return '';
    }
};
