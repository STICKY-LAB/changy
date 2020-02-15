import ChangeableClass from "../../ChangeableClass/ChangeableClass";
import Primitive, { PrimitiveChangeEventEmitter, NormalPrimitive } from "../Primitive/Primitive";
import toString from "./proto/toString";
import valueOf from "./proto/valueOf";
import String from "../String/String";

export interface BooleanChangeEventEmitter extends PrimitiveChangeEventEmitter<boolean> {};

export class NormalBoolean extends NormalPrimitive<boolean> {};

interface Boolean extends Primitive<boolean> {
    toString() : String,
    valueOf() : String
}


const proto = {
    toString,
    valueOf
};
Object.setPrototypeOf(proto, Primitive.proto); //Extends Primitive.

const Boolean = ChangeableClass<NormalBoolean,BooleanChangeEventEmitter>(
    NormalBoolean,
    proto
) as {
    new(value? : boolean) : Boolean,
    proto : typeof proto
};

export default Boolean;