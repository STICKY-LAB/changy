import Primitive from "./Primitive";
import OriginalFunction from "../Originals/Function";
import Array from "../Object/Array";
import String from "../Primitive/String";
import Number from "../Primitive/Number";
import Changeable, { O, C, S, IN } from "../../Changeable/Changeable";
import cF from "../../Util/cF";

export default class Function<T extends OriginalFunction> extends Primitive<T> {
    length = cF(f => f.length, Number, true)(this)[IN]();
    name = cF(f => f.name, String, true)(this)[IN]();
    
    Apply(thisArg : Primitive<any>, argsArray : Array<any> = new Array([])) {
        const result = cF((f, thisArg, argsArray) => f.apply(thisArg, argsArray))(this, thisArg, argsArray);
        return result;
    }
    Bind(thisArg : Primitive<any>, argsArray : Array<Changeable<any>> = new Array([])) {
        const result = cF((f, thisArg, argsArray) => f.bind(thisArg, ...argsArray), Function)(this, thisArg, Array.FromChangeable(argsArray));
        return result;
    }
    Call(thisArg : Primitive<any> = new Primitive(undefined), argsArray : Array<Changeable<any>> = new Array([])) {
        const result = cF((f, thisArg, argsArray) => f.call(thisArg, ...argsArray))(this, thisArg, Array.FromChangeable(argsArray));
        return result;
    }
    ToString() {
        const result = cF(f => f.toString(), String)(this);
        return result;
    }
}