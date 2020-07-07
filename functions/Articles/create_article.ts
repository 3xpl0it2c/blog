/*
 * As the name states -
 * We recieve an article in the request body,
 * Verify it, and insert it into the database.
*/

/* eslint-disable max-len */

import { Context } from 'koa';
import { object, string, number } from '@hapi/joi';
import { default as pick } from '@lib/entityFromObject';
import { declareAppModule } from '@lib/index';
import { ArticleInitiative } from "@interfaces/index";

const main = async (ctx: Context, next: () => Promise<unknown>): Promise<void> => {
    // ? A waste of memory.
    const requiredFields: ArticleInitiative = {
        title: '',
        subText: '',
        assetCount: 0,
        author: '',
    };

    const ArticleInitiativeJoi = object({
        title: string().required().alphanum(),
        subText: string().alphanum(),
        assetCount: number().integer().positive(),
        author: string().required().uuid(),
    });

    try {
        const articleBrief: ArticleInitiative = pick(requiredFields)(ctx.query);
        const safeArticleBrief = await ArticleInitiativeJoi.validateAsync(articleBrief);
    } catch (e) {
        void 0;
    };

    await next();
};

export default declareAppModule({
    httpMethod: 'POST',
    path: '/create_article',
    handler: main,
});
