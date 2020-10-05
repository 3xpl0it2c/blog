import { ID } from '@interfaces';

export type User = {
    id?: ID;
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};
