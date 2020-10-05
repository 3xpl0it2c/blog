/*
 * As the name states -
 * We recieve an article in the request body,
 * Verify it, and insert it into the database.
*/

/* eslint-disable max-len */

import { Context, Next } from 'koa';
import { object, string, number } from '@hapi/joi';
import { pick } from '@lib';
import { declareAppModule } from '@lib';
import { ArticleInitiative } from '@interfaces';

const handler = async (ctx: Context, next?: Next): Promise<void> => {
    // ? A waste of memory.
    const requiredFields = [
        'title',
        'subText',
        'assetCount',
        'author',
    ];

    const ArticleInitiativeJoi = object({
        title: string().required().alphanum(),
        subText: string().alphanum(),
        assetCount: number().integer().positive(),
        author: string().required().uuid(),
    });

    try {
        const articleBrief: ArticleInitiative = pick(requiredFields)(ctx.query);
        const safeArticleBrief = await ArticleInitiativeJoi.validateAsync(articleBrief);
        console.log(`Stub !\n: ${safeArticleBrief}`);
    } catch (e) {
        void 0;
    }

    await next ?? Promise.resolve();
};

export default declareAppModule({
    httpMethod: 'POST',
    path: '/create_article',
    handler,
});
