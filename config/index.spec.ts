import { default as readConfig } from './index';
import { readFile } from 'fs';
import { resolve } from 'path';

/*
describe('Config index file', () => {
    test('falsy env, assignDefaults, default conf', () => {});
    test('falsy env, no assignDefaults, default conf', () => {});
    test('production env, no assignDefaults, production conf', () => {});
}); */

test('load default config file properly', (done) => {
    const configPath = resolve(__dirname, './default.json');
    readFile(configPath, async (err, data) => {
        if (err) throw err;
        const jsonData = JSON.parse(data.toString());
        const test = await readConfig('testing');
        expect(test).toStrictEqual(jsonData);
        done();
    });
});
