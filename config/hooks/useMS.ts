/*
! This code is very slow.
! It needs a refactor IMO.
All it does is take the config object,
Go 2 levels deep,
Convert some keys from actual words like "2 days" to milliseconds
And return the new object with the converted keys.
*/

import ms from 'ms';

const convertKeywordsToMS = (
    elemOfTarget: string,
    keysToConvertInsideElem: Set<string>,
) => (target: Record<string, any>) => {
    const keyInTarget = target[elemOfTarget];

    if (keyInTarget !== undefined) {
        const convertedKeys = [...keysToConvertInsideElem].reduce(
            (acc: Record<string, any>, key: string) => {
                return Object.assign(acc, {
                    [`${key}`]: ms(keyInTarget[key]),
                });
            },
            {},
        );

        return Object.assign(keyInTarget, convertedKeys);
    }

    return target as any;
};

// * These are domain specific.
// * Please take time to tweak them to your own needs.
const defaultKeysToConvert = (): Record<string, any> => {
    const kafkaKeywords = new Set([
        'connectTimeout',
        'requestTimeout',
        'idleConnection',
    ]);

    return {
        kafka: kafkaKeywords,
    };
};

// elementsToConvert = which values to convert into ms from actual words.
// Please visit - https://github.com/zeit/ms for the formats supported.
export default (
    _: string,
    middlewareObject: Record<string, any>,
    elementsToConvert: Record<string, any>,
): Record<string, any> => {
    if (Object.keys(elementsToConvert).length == 0) {
        elementsToConvert = defaultKeysToConvert();
    }

    const keywords = Object.keys(elementsToConvert);

    const convertedElements = keywords.reduce(
        (acc: any, keyword: string): any => {
            // If the keyword is not included in the config,
            // Return the accumulator. (do nothing)
            if (middlewareObject[keyword] == undefined) return acc;

            const element = elementsToConvert[keyword];
            const converterAtKeyword = convertKeywordsToMS(keyword, element);
            const convertedKeys = converterAtKeyword(middlewareObject);

            return Object.assign(acc, {
                [`${keyword}`]: convertedKeys,
            });
        },
        {},
    );

    return Object.assign(middlewareObject, convertedElements);
};
