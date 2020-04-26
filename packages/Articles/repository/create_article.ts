/*
With a connector:
Take the given article and insert into the database.
*/

import { DatabasePoolType, DatabasePoolConnectionType, sql } from 'slonik';
import { Article } from '../domain';

const createArticle = (article: Article): any => {
    return async ({query}: DatabasePoolConnectionType): Promise<void> => {
        query(sql`INSERT INTO ARTICLES () VALUES()`);
    };
};

export default (article: Article) =>
    (pool: DatabasePoolType): Promise<unknown> => (
        pool.connect(
            createArticle(article),
        )
    );
