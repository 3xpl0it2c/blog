/*
Recurse a set of functions with one argument,
F1( F2( F3(Argument1) ) )
*/

type GenericFunction<G> = (arg: G) => G;

export default <T extends {}>(argument: T, ...funcs: GenericFunction<T>[]): T =>
    funcs.reduceRight((acc, func) => func(acc), argument);
