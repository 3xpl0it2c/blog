/**
 * @desc Assign Object a to Object b
 * @param {object} a - (Possibly) an array of objects to assign to the target
 * @param {object} b - The target to which everything is assigned.
 * */
export function assign(...a: any[]): any {
    return (b: any) => Object.assign({}, b, ...a);
}

