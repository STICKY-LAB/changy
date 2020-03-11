import Changeable, { O, C, S } from "../Changeable/Changeable";
import Boolean from "../BuiltIn/Primitive/Boolean";
import cF from "./cF";

export default function equals(a : Changeable<any>, b : Changeable<any>) {
    const result = cF((a : number, b : number) => {
        return a === b;
    }, Boolean)(a, b);

    return result;
}