import Number from "../Number";
import { O, C, S } from "../../../Changeable";
import String from "../../String/String";
import Primitive from "../../Primitive/Primitive";
import Object from "../../Object/Object";

export default function toLocaleString(
    this : Number,
    locales : String = <any> new Primitive(undefined),
    options : Object = <any> new Object(undefined)
) {
    const result = new String(this[O].value.toLocaleString(locales[O].value, options[O]));
    
    const listener = (value : number) => {
        result.set(value.toLocaleString(locales[O].value, options[O]));
    };
    const localesListener = (value : string) => {
        result.set(this[O].value.toLocaleString(value, options[O]));
    };
    const optionsListener = () => {
        result.set(this[O].value.toLocaleString(locales[O].value, options[O]))
    };

    this[C].on("set", listener);
    locales[C].on("set", localesListener);
    options[C].onAny(optionsListener);

    result[S] = () => {
        this[C].off("set", listener);
        locales[C].off("set", localesListener);
        options[C].offAny(optionsListener);
    };
    return result;
}