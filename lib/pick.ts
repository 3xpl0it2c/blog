/*
 * Provide an array of keys (or an object with the keys you want)
 * And get the keys you specified extracted from the target.
 * In case any keys were missing, the result is a None.
 */

import { assign } from '@lib';
import { none, some, map, fromNullable, Option } from 'fp-ts/Option';
import { pipe } from 'fp-ts/pipeable';

// Just extract the keys from an object,
// This is here because we also accept an objects as a schema.
const makeSchema = (schema: Record<string, any> | string[]): string[] => {
    return schema instanceof Array ? schema : Object.keys(schema);
};

const objEmpty = (target: any): boolean => Object.keys(target).length == 0;

const pick = (schema: Record<string, any> | string[]) => (
    target?: Record<string, unknown> | null,
): Option<any> => {
    if (!target || objEmpty(target)) {
        return none;
    }

    const fieldsToExtract: string[] = makeSchema(schema);

    if (fieldsToExtract.length == 0) {
        return some(target);
    }

    if (fieldsToExtract.length == 1) {
        return fromNullable(target[`${fieldsToExtract[0]}`]);
    }

    return fieldsToExtract.reduce((acc: Option<any>, field: string) => {
        const accumulate = (acc: any) => assign(acc, {
            [`${field}`]: target[field],
        });

        return pipe(
            acc,
            map(accumulate),
        );
    }, some({}));
};

export { pick };
