import ChangeableClass from "../../ChangeableClass/ChangeableClass";
import Primitive, { PrimitiveChangeEventEmitter, NormalPrimitive } from "../Primitive/Primitive";
import OriginalFunction from "./OriginalFunction";
import call from "./proto/call";
import apply from "./proto/apply";
import bind from "./proto/bind";
import toString from "./proto/toString";
import Array from "../Array/Array";
import Changeable from "../../Changeable";
import String from "../String/String";
import Number from "../Number/Number";
import length from "./proto/length";
import name from "./proto/name";

export interface FunctionChangeEventEmitter extends PrimitiveChangeEventEmitter<OriginalFunction> {};

export class NormalFunction extends NormalPrimitive<OriginalFunction> {};

interface Function extends Primitive<OriginalFunction> {
    call(thisArg? : Primitive<any>, argsArray? : Array<Changeable<any,any>>) : Primitive<any>,
    apply(thisArg : Primitive<any>, argsArray? : Array<any>) : Primitive<any>
    bind(thisArg : Primitive<any>, argsArray? : Array<any>) : Function
    toString() : String,
    length : Number,
    name : String
};

const proto = {
    call,
    apply,
    bind,
    toString,
    get length() {
        return length.call(this);
    },
    get name() {
        return name.call(this);
    }
};
Object.setPrototypeOf(proto, Primitive.proto); //Extends Primitive.

const Function = ChangeableClass<NormalFunction, FunctionChangeEventEmitter>(
    NormalFunction,
    proto
) as {
    new(value : OriginalFunction) : Function
    proto : typeof proto
};

export default Function;