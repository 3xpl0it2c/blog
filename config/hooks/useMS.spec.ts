import useMS from './useMS';

describe('useMS Config hook (useMS.ts)', () => {

    test('with Target, with Config, pass', () => {
        const objectForTesting = {
            testing: {
                testing1: '1 hour',
            },
        };

        const objectAfterConversion = {
            testing: {
                testing1: 3600000,
            },
        };

        const objectConfiguration = {
            testing: new Set(['testing1']),
        };

        expect(useMS('', objectForTesting, objectConfiguration))
            .toStrictEqual(objectAfterConversion);
    });
});
