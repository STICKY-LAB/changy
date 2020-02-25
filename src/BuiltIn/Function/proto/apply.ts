import Function from "../Function";
import Primitive from "../../Primitive/Primitive";
import { O, C, S } from "../../../Changeable";
import Array from "../../Array/Array";
import OriginalFunction from "../OriginalFunction";

export default function apply<T extends OriginalFunction>(this : Function<T>, thisArg : Primitive<any>, argsArray : Array<any> = new Array()) {
    const result = new Primitive(this[O].value.apply(thisArg[O].value, argsArray[O]));

    const listener = (f : OriginalFunction) => {
        result.set(f.apply(thisArg[O].value, argsArray[O]));
    };
    const thisListener = (thisArg : any) => {
        result.set(this[O].value.apply(thisArg, argsArray[O]));
    };
    const argsArrayListener = (start : number, deleted : any[], inserted : any[]) => {
        result.set(this[O].value.apply(thisArg[O].value, argsArray[O]));
    };

    this[C].on("set", listener);
    thisArg[C].on("set", thisListener);
    argsArray[C].on("insert", argsArrayListener);

    result[S] = () => {
        this[C].off("set", listener);
        thisArg[C].off("set", thisListener);
        argsArray[C].off("insert", argsArrayListener);
    };

    return result;
}