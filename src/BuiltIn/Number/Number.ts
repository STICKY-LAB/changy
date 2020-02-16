import ChangeableClass from "../../ChangeableClass/ChangeableClass";
import Primitive, { PrimitiveChangeEventEmitter, NormalPrimitive } from "../Primitive/Primitive";
import toExponential from "./proto/toExponential";
import toFixed from "./proto/toFixed";
import toLocaleString from "./proto/toLocaleString";
import toPrecision from "./proto/toPrecision";
import toString from "./proto/toString";
import String from "../String/String";
import Object from "../Object/Object";
import valueOf from "./proto/valueOf";
import OriginalObject from "../Object/OriginalObject";
import isFinite from "./static/isFinite";
import Boolean from "../Boolean/Boolean";
import isInteger from "./static/isInteger";
import isNaN from "./static/isNaN";
import isSafeInteger from "./static/isSafeInteger";
import parseFloat from "./static/parseFloat";
import parseInt from "./static/parseInt";

export interface NumberChangeEventEmitter extends PrimitiveChangeEventEmitter<number> {};

export class NormalNumber extends NormalPrimitive<number> {};

interface Number extends Primitive<number> {
    toExponential(fractionDigits? : Number) : String,
    toFixed(digits? : Number) : String,
    toLocaleString(locales? : String, options? : Object) : String,
    toPrecision(precision? : Number) : String,
    toString(radix? : Number) : String,
    valueOf() : Number
}


const proto = {
    toExponential,
    toFixed,
    toLocaleString,
    toPrecision,
    toString,
    valueOf
};
OriginalObject.setPrototypeOf(proto, Primitive.proto); //Extends Primitive.

const Number = ChangeableClass<NormalNumber,NumberChangeEventEmitter>(
    NormalNumber,
    proto
) as {
    new(value : number) : Number,
    proto : typeof proto,
    isFinite(value : Number) : Boolean,
    isInteger(value : Number) : Boolean,
    isNaN(value : Number) : Boolean,
    isSafeInteger(value : Number) : Boolean,
    parseFloat(string : String) : Number,
    parseInt(string : String) : Number
};

Number.isFinite = isFinite;
Number.isInteger = isInteger;
Number.isNaN = isNaN;
Number.isSafeInteger = isSafeInteger;
Number.parseFloat = parseFloat;
Number.parseInt = parseInt;


export default Number;