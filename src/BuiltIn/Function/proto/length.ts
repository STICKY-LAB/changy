import Function from "../Function";
import Number from "../../Number/Number";
import { O, C, S } from "../../../Changeable";
import OriginalFunction from "../OriginalFunction";


export default function length(this : Function) {
    const result = new Number(this[O].value.length);

    const listener = (f : OriginalFunction) => {
        result.set(f.length);
    };

    this[C].on("set", listener);

    result[S] = () => {
        this[C].off("set", listener);
    };

    return result;
}