import { ID } from '@interfaces';

export type Article = {
    title: string;
    author: ID;
    body: string;
    comments: ID[];
    assets: ID[];
    subText: string;
};

export type ArticleInitiative = {
    title: string;
    author: ID;
    subText?: string;
    assetCount: number;
};
