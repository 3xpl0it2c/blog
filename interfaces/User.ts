import ID from '@interfaces/ID';

export type User = {
    name: string;
    lastName: string;
    email: string;
    password: string;
    salt: string;
    articles: ID[];
};
