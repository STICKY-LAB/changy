
import Primitive from "../BuiltIn/Primitive/Primitive";
import cF from "./cF";

export default function fill<T>(original : Primitive<T>, fill : T) : Primitive<T> {
    return cF(value => value ?? fill)(original);
}