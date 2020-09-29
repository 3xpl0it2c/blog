import { Left, Right } from 'crocks/Either';
import { Schema, isSchema } from '@hapi/joi';

export const eitherSchema = (schema: Schema) => (target: any) => {
    const onNotSchema = new TypeError('First arg must be a joi Schema !');

    if (!isSchema(schema)) return Left(onNotSchema);

    return schema
        .validateAsync(target)
        .then(Right)
        .catch(Left);
};
