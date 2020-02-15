import Number from "../Number";
import { O, C, S } from "../../../Changeable";
import OriginalNumber from "../OriginalNumber";
import String from "../../String/String";

export default function parseFloat(string : String) {
    const result = new Number(OriginalNumber.parseFloat(string[O].value));

    const listener = (value : string) => {
        result.set(OriginalNumber.parseFloat(value));
    };

    string[C].on("set", listener);

    result[S] = () => {
        string[C].off("set", listener);
    };

    return result;
}