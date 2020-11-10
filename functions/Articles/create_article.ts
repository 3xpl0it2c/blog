/*

*/

/* eslint-disable max-len */

import { Context, Next } from 'koa';
import { object, string, number } from 'joi';
import { pick } from '@lib';
import { declareAppModule } from '@lib';
import { ArticleInitiative } from '@interfaces';

const handler = async (ctx: Context, next?: Next): Promise<void> => {
    await (next ?? Promise.resolve());

    // ? A waste of memory.
    const requiredFields = ['title', 'subText', 'assetCount', 'author'];

    const articleInitiativeJoiSchema = object({
        title: string().required().alphanum(),
        subText: string().alphanum(),
        assetCount: number().integer().positive(),
        author: string().required().uuid(),
    });

    const articleBrief: ArticleInitiative = pick(requiredFields)(ctx.query);

    const safeArticleBrief = await articleInitiativeJoiSchema
        .validateAsync(articleBrief)
        .catch();
};

export default declareAppModule({
    httpMethod: 'POST',
    path: '/create_article',
    handler,
});
