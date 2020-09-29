import { object, string } from '@hapi/joi';
import Either from 'crocks/Either';

import { eitherSchema } from './eitherSchema';

describe('eitherSchema.ts', () => {
    test('Object Schema, no target, return Left', () => {
        const testSchema = object({
            testProp: string().max(4),
        });

        const testValue = null;

        expect(eitherSchema(testSchema)(testValue)).toMatchObject(
            Either.Left(null),
        );
    });
});
