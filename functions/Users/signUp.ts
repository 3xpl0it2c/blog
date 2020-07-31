import { DatabasePoolType, sql } from 'slonik';
import { User } from '@interfaces';
import { hashPassword } from '@lib';
import {Logger} from 'log4js';

export const signUp = (user: User) => async (
    slonik: DatabasePoolType,
    logger: Logger,
) => {
    const { firstName, lastName, email, password } = user;

    try {
        const hashedPass = hashPassword(password);
        slonik.connect(async (conn) => {
            await conn.query(sql`
                             INSERT INTO users
                             (firstName, lastName, email, password)
                             VALUES
                             (${sql.array([firstName, lastName, email, hashedPass], 'text')})
                             `);
        });
    } catch (why) {}
};

