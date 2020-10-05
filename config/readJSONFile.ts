import { readFile, PathLike } from 'fs';
import { promisify } from 'util';

// Read about the reviver function here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter
type reviverFunc = (key: string, value: any) => any;

/* eslint-disable comma-dangle,max-len */
const readFilePromise = promisify(readFile);

// This is the default function which is imported as readJSONFile.
export default async (pathToJSON: PathLike, reviver?: reviverFunc): Promise<any> => {
    const fileData = await readFilePromise(pathToJSON);
    // If reviver !== undefined use reviver, else - use the default.
    const jsonReviver = !!reviver
        ? reviver
        : (_: string, value: any): any => value;

    return JSON.parse(fileData.toString(), jsonReviver);
};
