/*
 * @desc Assign Object a to Object b
 * @param {object} a - (Possibly) an array of objects to assign to the target
 * @param {object} b - The target to which everything is assigned.
 * */

// By putting an empty object as the first argument, we promise immutability.
export const assign = (...a: any) => (b: any) => Object.assign({}, b, ...a);
