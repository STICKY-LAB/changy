import Function from "../Function";
import String from "../../String/String";
import { O, C, S } from "../../../Changeable";
import OriginalFunction from "../OriginalFunction";


export default function toString<T extends OriginalFunction>(this : Function<T>) {
    const result = new String(this[O].value.toString());

    const listener = (f : OriginalFunction) => {
        result.set(f.toString());
    };

    this[C].on("set", listener);

    result[S] = () => {
        this[C].off("set", listener);
    };

    return result;
}