import Number from "../Number";
import { O, C, S } from "../../../Changeable";
import String from "../../String/String";
import Primitive from "../../Primitive/Primitive";

export default function toExponential(this : Number, fractionDigits : Number = <any> new Primitive(undefined)) {
    const result = new String(this[O].value.toExponential(fractionDigits[O].value));
    
    const listener = (value : number) => {
        result.set(value.toExponential(fractionDigits[O].value));
    };
    const fractionDigitsListener = (value : number) => {
        result.set(this[O].value.toExponential(value));
    };

    this[C].on("set", listener);
    fractionDigits[C].on("set", fractionDigitsListener);

    result[S] = () => {
        this[C].off("set", listener);
        fractionDigits[C].off("set", fractionDigitsListener);
    };
    return result;
}