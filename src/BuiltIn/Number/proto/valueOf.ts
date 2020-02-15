import Number from "../Number";
import { O, C, S } from "../../../Changeable";

export default function valueOf(this : Number) {
    const result = new Number(this[O].value);
    
    const listener = (value : number) => {
        result.set(value);
    };

    this[C].on("set", listener);

    result[S] = () => {
        this[C].off("set", listener);
    };

    return result;
}