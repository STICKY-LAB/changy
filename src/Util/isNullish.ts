
import Primitive from "../BuiltIn/Primitive/Primitive";
import cF from "./cF";
import Boolean from "../BuiltIn/Primitive/Boolean";

function isNullish(value : Primitive<any>) {
    return cF(value => value === null || value === undefined, Boolean)(value);
}

export default isNullish;