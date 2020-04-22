import Primitive from "../BuiltIn/Primitive/Primitive";
import cF from "./cF";
import Boolean from "../BuiltIn/Primitive/Boolean";



export default function iF<A, B, P extends Primitive<A | B>>(trueValue : A, falseValue : B, primitiveClass : (new (value : A | B) => P) = <any>Primitive)
:
(boolean : Boolean) => (P)
{
    return cF(boolean => boolean ? trueValue : falseValue, primitiveClass);
}