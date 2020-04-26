import { default as pick } from './entityFromObject';

describe('entityFromObject', () => {
    test('No Target, With Schema, fail', () => {
        const target = {};
        const schema = ['any_prop'];
        expect(() => pick(schema)(target))
            .toThrow('target is empty');
    });

    test('With target, With Schema, pass', () => {
        const target = {
            'any_prop': 'any_value',
            'desired_prop': 'desired_value',
        };
        const schema = ['desired_prop'];
        const result = {
            'desired_prop': 'desired_value',
        };

        expect(pick(schema)(target))
            .toEqual(result);
    });

    test('With target, No Schema, pass', () => {
        const target = {
            'any_prop': 'any_value',
            'another_prop': 'another_any_value',
        };
        const schema = [];
        expect(pick(schema)(target))
            .toEqual(target);
    });

    test('With target, With Object Schema, pass', () => {
        const target = {
            'any_prop': 'any_value',
            'desired_prop': 'another_any_value',
        };

        const schema = {
            'desired_prop': 'another_any_value',
        };

        expect(pick(schema)(target))
            .toEqual(schema);
    });
    test('With target, Empty Object Schema, pass', () => {
        const target = {
            'any_prop': 'any_value',
            'another_prop': 'another_any_value',
        };
        const schema = {};

        expect(pick(schema)(target))
            .toEqual(target);
    });
});
