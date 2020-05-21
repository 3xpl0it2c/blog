import { zipArrays, rzipArrays } from './zip';

describe('zipArrays', () => {
	test('No params, return null', () => {
		expect(zipArrays()).toBeNull();
	});

	test('One param, return params as is', () => {
		// Could be anything, this is just random.
		const testParams = [ 'a', 'n', 'a', 'r', 'r', 'a', 'y' ];
		expect(zipArrays()).toStrictEqual(testParams);
	});

	test('Multiplie params, return params combined', () => {
	});
});

describe('rZipArrays', () => {
	test('No params, return null', () => {
		expect(rzipArrays()).toBeNull();
	});

	test('One param, return params as is', () => {
		const testParams = [ 'a', 'n', 'a', 'r', 'r', 'a', 'y' ];
		expect(rzipArrays(testParams)).toStrictEqual(testParams);
	});

	test('Multiplie params, return params combined', () => {
		const 
	});
});
