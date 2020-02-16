import Function from "../Function";
import { O, C, S } from "../../../Changeable";
import OriginalFunction from "../OriginalFunction";
import String from "../../String/String";


export default function name(this : Function) {
    const result = new String(this[O].value.name);

    const listener = (f : OriginalFunction) => {
        result.set(f.name);
    };

    this[C].on("set", listener);

    result[S] = () => {
        this[C].off("set", listener);
    };

    return result;
}