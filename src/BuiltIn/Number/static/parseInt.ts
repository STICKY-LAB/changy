import Number from "../Number";
import { O, C, S } from "../../../Changeable";
import OriginalNumber from "../OriginalNumber";
import String from "../../String/String";

export default function parseInt(string : String) {
    const result = new Number(OriginalNumber.parseInt(string[O].value));

    const listener = (value : string) => {
        result.set(OriginalNumber.parseInt(value));
    };

    string[C].on("set", listener);

    result[S] = () => {
        string[C].off("set", listener);
    };

    return result;
}