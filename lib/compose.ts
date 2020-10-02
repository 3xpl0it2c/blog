/*
Recurse a set of functions with one argument,
F1( F2( F3(Argument1) ) )
*/
import { Identity } from '@interfaces';

export const compose = <T extends any>(
    argument: T,
    ...funcs: Identity<T>[]
): T => funcs.reduceRight((acc, func) => func(acc), argument);
