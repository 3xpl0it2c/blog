import { DatabasePoolType, sql } from 'slonik';
import { User } from '@interfaces';
import { hashPassword } from '@lib';
import {Logger} from 'log4js';

export const signUp = (user: User, verificationToken: string) => async (
    slonik: DatabasePoolType,
    logger: Logger,
): Promise<string> => {
    const { firstName, lastName, email, password } = user;
    const hashedPass = await hashPassword(password, logger);

    try {
        if (!hashedPass) throw new Error('Failed to hash password');

        const userId: Promise<string> = new Promise((resolve, reject) => {
            slonik.connect(async (conn) => {
                const now = new Date();
                const fields = sql.array([
                    firstName,
                    lastName,
                    email,
                    hashedPass,
                    now,
                    verificationToken,
                ], 'text');

                const newUserId: any = await conn.oneFirst(sql`
                             INSERT INTO users
                             (
                              firstName,
                              lastName,
                              email,
                              password,
                              registration_date,
                              verify_token
                             )
                             VALUES
                             (${fields})
                             RETURNING id;
                             `);

                if (newUserId instanceof Error) return reject(newUserId);

                return resolve(newUserId);
            });
        });

        return await userId;
    } catch (why) {
        return '';
    }
};
