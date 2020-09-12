/**
 * @desc Checks whether a response from ioredis is successful or not.
 * @param {string} response - the response from ioredis call.
*/

// * OK means the command executed successfully.
// IORedis basically maps the response in a 1-to-1 fashion (As far as I see).
export const responseOk = (response: 'OK' | null): boolean => response === 'OK';
