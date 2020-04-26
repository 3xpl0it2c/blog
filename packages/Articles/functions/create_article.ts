/*
What you need: An Article.
How are you going to get it ?
Via URL query parameters.
What are you going to do with that Article ?
Insert it into the database.
*/

/* eslint-disable max-len */

import { Context } from 'koa';
import { object, string, number } from '@hapi/joi';
import { default as pick } from '@lib/entityFromObject';
import { ArticleInitiative } from '../domain/Article';
import { Module } from '../domain/module';

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

export default {
    httpMethod: 'POST',
    path: '/create_article',
    handler: main,
} as Module;
