import Boolean from "../Boolean";
import { O, C, S } from "../../../Changeable";


export default function valueOf(this : Boolean) {
    const result = new Boolean(this[O].value);

    const listener = (value : boolean) => {
        result.set(value);
    };

    this[C].on("set", listener);

    result[S] = () => {
        this[C].off("set", listener);
    };

    return result;
}