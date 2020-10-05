import readJSONFile from './readJSONFile';
import { readFileSync } from 'fs';
import { resolve } from 'path';

test('ReadJSONFile Reads Properly', (done) => {
    const defaultConfigPath = resolve(__dirname, `./default.json`);
    const configFileBuffer = readFileSync(defaultConfigPath);
    const configFileAsObject = JSON.parse(configFileBuffer.toString());

    readJSONFile(defaultConfigPath).then((data) => {
        expect(data).toStrictEqual(configFileAsObject);
        done();
    });
});
