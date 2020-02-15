import Boolean from "../Boolean";
import { O, C, S } from "../../../Changeable";
import String from "../../String/String";


export default function toString(this : Boolean) {
    const result = new String(this[O].value.toString());

    const listener = (value : boolean) => {
        result.set(value.toString());
    };

    this[C].on("set", listener);

    result[S] = () => {
        this[C].off("set", listener);
    };

    return result;
}