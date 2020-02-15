import Number from "../Number";
import Primitive from "../../Primitive/Primitive";
import { O, C, S } from "../../../Changeable";
import String from "../../String/String";

export default function toPrecision(this : Number, precision : Number = <any> new Primitive(undefined)) {
    const result = new String(this[O].value.toPrecision(precision[O].value));
    
    const listener = (value : number) => {
        result.set(value.toPrecision(precision[O].value));
    };
    const precisionListener = (value : number) => {
        result.set(this[O].value.toPrecision(value));
    };

    this[C].on("set", listener);
    precision[C].on("set", precisionListener);

    result[S] = () => {
        this[C].off("set", listener);
        precision[C].off("set", precisionListener);
    };

    return result;
}