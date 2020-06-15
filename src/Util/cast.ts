import Primitive from "../BuiltIn/Primitive/Primitive";
import cF from "./cF";

export default function cast<R, P extends Primitive<R>>(original : Primitive<R>, primitiveClass : (new (value : R) => P) = <any>Primitive) : P {
    return cF(v => v, primitiveClass)(original);
}