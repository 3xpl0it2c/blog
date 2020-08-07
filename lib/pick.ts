const getObjectKeys = (schema: Record<string, any> | string[]): string[] => {
    return schema instanceof Array
        ? schema
        : Object.keys(schema);
};

const objEmpty = (target: any): boolean => (
    Object.keys(target).length == 0/* && !(target instanceof Date) */
);


/*
 * Provide an array of keys (or an object with the keys you want)
 * And get the keys you specified extracted from the target.
 * In case any keys were missing, check the __missing attribute.*/
const pick = (
    schema: Record<string, any> | string[],
) => (target: Record<string, unknown>): any => {
    if (objEmpty(target)) {
        throw new Error('target is empty');
    }

    const requiredFields = getObjectKeys(schema);

    if (requiredFields.length == 0) { // If schema is empty.
        return target;
    }

    return requiredFields.reduce((acc: any, field: string) => {
        const element = target[field];

        if (!!element) {
            return Object.assign(acc, {
                [`${field}`]: target[field],
            });
        } else {
            (acc?.__missing)
                ? acc.__missing.push(field)
                : acc.__missing = [field];
        }
    }, {});
};

export { pick };
