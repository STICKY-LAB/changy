import Changeable, { O, C, S } from "../Changeable/Changeable";
import Primitive from "../BuiltIn/Primitive/Primitive";

type Remove<A, B> = A extends B ? never : A;
type ArrayKeys<Arr extends Array<any>> = Remove<
    keyof Arr,
    number | "length" | "toString" | "toLocaleString" | "pop" | "push" | "concat" | "join" | "reverse" | "shift" | "slice"
    | "sort" | "splice" | "unshift" | "indexOf" | "lastIndexOf" | "every" | "some" | "forEach" | "map" | "filter" | "reduce"
    | "reduceRight" | "find" | "findIndex" | "fill" | "copyWithin" | "entries" | "keys" | "values" | "includes" | "flatMap" | "flat"
>;

type C = ArrayKeys<[1,2,3]>
//Args types can make some errors.

export default function cF
<OriginalArgs extends Array<any>, Args extends ({[K in ArrayKeys<OriginalArgs>]: Changeable<OriginalArgs[K]>} & Array<Changeable<OriginalArgs[number]>>), R, P extends Primitive<R>>
(callback : (...targetOriginalObjects : OriginalArgs) => R, primitiveClass : (new (value : R) => P) = <any>Primitive, maybe = false)
:
(...args : Args) => (P)
{
    return <any>((...args : Args) => {
        function computeValue() {
            return (
                maybe && !(args.map(arg => arg[O]).every(value => !(value === null || value === undefined))) ?
                    undefined
                :
                    callback(...<any>args.map(arg => arg[O]))
            );
        }
        const result = new primitiveClass(computeValue());
    
        const listener = () => {
            result.set(
                computeValue()
            );
        };

        args.forEach((arg) => {
            arg[C].on(/^/, listener, result);
        });
    
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