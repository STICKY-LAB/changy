import Number from "../Number";
import Primitive from "../../Primitive/Primitive";
import { O, C, S } from "../../../Changeable";
import String from "../../String/String";

export default function toString(this : Number, radix : Number = <any> new Primitive(undefined)) {
    const result = new String(this[O].value.toString(radix[O].value));
    
    const listener = (value : number) => {
        result.set(value.toString(radix[O].value));
    };
    const radixListener = (value : number) => {
        result.set(this[O].value.toString(value));
    };

    this[C].on("set", listener);
    radix[C].on("set", radixListener);

    result[S] = () => {
        this[C].off("set", listener);
        radix[C].off("set", radixListener);
    };

    return result;
}