import Changeable, { O, C, S } from "../Changeable/Changeable";
import Primitive from "../BuiltIn/Primitive/Primitive";

type Remove<A, B> = A extends B ? never : A;
type ArrayKeys<Arr extends Array<any>> = Remove<
    keyof Arr,
    number | "length" | "toString" | "toLocaleString" | "pop" | "push" | "concat" | "join" | "reverse" | "shift" | "slice"
    | "sort" | "splice" | "unshift" | "indexOf" | "lastIndexOf" | "every" | "some" | "forEach" | "map" | "filter" | "reduce"
    | "reduceRight" | "find" | "findIndex" | "fill" | "copyWithin" | "entries" | "keys" | "values" | "includes" | "flatMap" | "flat"
>;
//Args types can make some errors.

export default function primitiveFunction
<OriginalArgs extends Array<any>, Args extends ({[K in ArrayKeys<OriginalArgs>]: Changeable<OriginalArgs[K]>} & Array<Changeable<OriginalArgs[number]>>), R, P extends Primitive<R>>
(callback : (...targetOriginalObjects : OriginalArgs) => R, primitiveClass : (new (value : R) => P) = <any>Primitive)
:
(...args : Args) => (P)
{
    return <any>((...args : Args) => {
        const result = new primitiveClass(callback(...<any>args.map(arg => arg[O])));
    
        const listener = () => {
            result.set(callback(...<any>args.map(arg => arg[O])));
        };

        args.forEach((arg) => {
            arg[C].onAny(listener);
        });

        result[S] = () => {
            args.forEach((arg) => {
                arg[C].offAny(listener);
            });
        };
    
        return result;
    });
};

/*
class A<T> {
    value: T;
    constructor(value : T) {
        this.value = value;
    }
}

class B extends A<number> {}

function createClassExtendsA<T>(aClass : {new<T>(value:T):A<T>}, value : T) {
    return new aClass(value);
}
*/