import Changeable, { O, C, S } from "../Changeable/Changeable";
import Primitive, { NormalPrimitive } from "../BuiltIn/Primitive/Primitive";

export default function primitiveFunction<OriginalArgs extends Array<Object>, Args extends Array<Changeable<OriginalArgs[number]>>, R>(callback : (...targetOriginalObjects : OriginalArgs) => R) : (...args : Args) => Primitive<R> {
    return (...args : Args) => {
        const result = new Primitive(callback(...<any>args.map(arg => arg[O])));
    
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
    };
};