import Number from "../Number";
import { O, C, S } from "../../../Changeable";
import String from "../../String/String";

export default function toFixed(this : Number, digits : Number = new Number(0)) {
    const result = new String(this[O].value.toFixed(digits[O].value));
    
    const listener = (value : number) => {
        result.set(value.toFixed(digits[O].value));
    };
    const digitsListener = (value : number) => {
        result.set(this[O].value.toFixed(value));
    };

    this[C].on("set", listener);
    digits[C].on("set", digitsListener);

    result[S] = () => {
        this[C].off("set", listener);
        digits[C].off("set", digitsListener);
    };
    return result;
}