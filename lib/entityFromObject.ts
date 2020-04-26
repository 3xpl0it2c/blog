/* eslint-disable max-len, @typescript-eslint/no-explicit-any */

// ? rename to convertToArr
const safeSchema = (schema: Record<string, any> | string[]): string[] => {
    return schema instanceof Array
        ? schema
        : Object.keys(schema);
};

const objEmpty = (target: any): boolean => Object.keys(target).length == 0/* && !(target instanceof Date) */;

const pick = (schema: Record<string, any> | string[]) => (target: any): any => {

    if (objEmpty(target)) {
        throw new Error('target is empty');
    };

    const requiredFields = safeSchema(schema);

    if (requiredFields.length == 0) { // If schema is empty.
        return target;
    }

    return requiredFields.reduce((acc: any, field: string) => {
        const element = target.hasOwnProperty(field);

        if (!!element) {
            return Object.assign(acc, { [`${field}`]: target[field] });
        } else {
            (acc?.__missing)
                ? acc.__missing.push(field)
                : acc.__missing = [field];
        };
    }, {});
};

export default pick;
