/*
 * Provide an array of keys (or an object with the keys you want)
 * And get the keys you specified extracted from the target.
 * In case any keys were missing, check the __missing attribute.
*/

// Just extract the keys from an object,
// This is here because we also accept an empty object as a schema.
const makeSchema = (schema: Record<string, any> | string[]): string[] => {
    return schema instanceof Array ? schema : Object.keys(schema);
};

const objEmpty = (target: any): boolean => Object.keys(target).length == 0;

const pick = (schema: Record<string, any> | string[]) => (
    target?: Record<string, unknown> | null,
): any => {
    if (!target || objEmpty(target)) {
        throw new Error('target is empty');
    }

    const requiredFields = makeSchema(schema);

    if (requiredFields.length == 0) {
        return target;
    }

    return requiredFields.reduce((acc: any, field: string) => {
        const element = target[field];

        if (!!element) {
            return Object.assign(acc, {
                [`${field}`]: target[field],
            });
        } else {
            acc?.__missing
                ? acc.__missing.push(field) // Impure, but much simpler.
                : (acc.__missing = [field]);
            return acc;
        }
    }, {});
};

export { pick };
