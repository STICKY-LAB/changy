import Primitive from "../../Primitive/Primitive";
import Object from "../Object";
import { O, C, S } from "../../../Changeable";
import OriginalObject from "../OriginalObject";

export default function toString(this : Object) : Primitive<string> {
    const result = new Primitive(OriginalObject.prototype.toString.call(this[O]));
    return result;
}