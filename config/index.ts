/*
* Please start from the default export.
With the given environment we are in (prod?),
Load the appropriate config file
And if requested so - load the config default and assign it.
*/

import { resolve } from 'path';
import { PathLike } from 'fs';

import readJSONFile from './readJSONFile';
import useValueFromENV from './hooks/useValueFromENV';
import useMS from './hooks/useMS';

import { appConfiguration } from '../interfaces/appConfig';
import { assign } from '@lib';

export const configReviver = (key: string, value: any): any => {
    // * Use Hooks to verify api keys, escape special chars and so forth.
    // ! Never return undefined, void and so forth. (except null)
    // ! You never know what depends on your hook's return value.

    switch (key) {
    case 'port' || 'host':
        return useValueFromENV(key, value);
    case 'middleware':
        return useMS(key, value, {});
    default:
        return value as any;
    }
};

const getDefaultConfig = async (path: PathLike = '.'): Promise<any> => {
    const confPath = resolve(__dirname, `${path}/default.json`);
    try {
        const defaultConfig = await readJSONFile(confPath);
        return defaultConfig;
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error(`Invalid default config path !\nPath: ${confPath}`);
        }
    }
};

export default async (
    env = 'production',
    assignDefaults = false,
    configPath: PathLike = '.',
): Promise<appConfiguration> => {
    let output;
    const defaults = await getDefaultConfig(configPath);

    try {
        const pathToConfig = resolve(
            __dirname,
            `${configPath}/${env}-config.json`,
        );
        const configFile = await readJSONFile(pathToConfig, configReviver);

        switch (true) {
        case configFile instanceof Error:
            throw configFile;
        case !configFile:
            output = defaults;
            console.error('Config is empty, using defaults.');
            break;
        case assignDefaults:
            output = assign(defaults)(configFile);
            break;
        default:
            output = configFile;
            break;
        }
    } catch (error) {
        switch (true) {
        case env === 'testing':
            output = defaults;
            break;
            // Invalid file path
        case error.code === 'ENOENT':
            console.warn(
                `No matching config file for current environment: ${env}`,
            );
            output = defaults;
            break;
        default:
            console.error(error.message);
        }
    } finally {
        return output;
    }
};
