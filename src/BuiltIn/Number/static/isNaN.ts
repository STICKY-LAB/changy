import Number from "../Number";
import Boolean from "../../Boolean/Boolean";
import { O, C, S } from "../../../Changeable";
import OriginalNumber from "../OriginalNumber";

export default function isNaN(value : Number) {
    const result = new Boolean(OriginalNumber.isNaN(value[O].value));

    const listener = (value : number) => {
        result.set(OriginalNumber.isNaN(value));
    };

    value[C].on("set", listener);

    result[S] = () => {
        value[C].off("set", listener);
    };

    return result;
}