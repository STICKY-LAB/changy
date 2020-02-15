import ChangeableClass from "../../ChangeableClass/ChangeableClass";
import Primitive, { PrimitiveChangeEventEmitter, NormalPrimitive } from "../Primitive/Primitive";

export interface StringChangeEventEmitter extends PrimitiveChangeEventEmitter<string> {};

export class NormalString extends NormalPrimitive<string> {};

interface String extends Primitive<string> {
    
};

const proto = {
    
};
Object.setPrototypeOf(proto, Primitive.proto); //Extends Primitive.

const String = ChangeableClass<NormalString, StringChangeEventEmitter>(
    NormalString,
    proto
) as {
    new(value : string) : String
    proto : typeof proto
};

export default String;