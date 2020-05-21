/*
 * Append many arrays into one array, ordered.
 * Includes also an reversed version.
 * Recommended for use with worker threads or promises, since this could be expensive.
*/


export const zipArrays = (...arrays: Array<any>[]) => {
	if (arrays.length === 0) return null;

	return arrays.reduce((acc: Array<any>[], array: any[]) => {
		return acc.concat(array);
	}, []);
};


export const rzipArrays = (...arrays: Array<any>[]) => {
	if (arrays.length === 0) return null;

	return arrays.reduceRight((acc: Array<any>[], array: any[]) => {
		return acc.concat(array);
	}, []);
};
