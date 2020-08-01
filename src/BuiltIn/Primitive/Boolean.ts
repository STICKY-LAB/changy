import Primitive from "./Primitive";
import { O, C, S } from "../../Changeable/Changeable";
import String from "./String";
import cF from "../../Util/cF";

export default class Boolean extends Primitive<boolean> {
    ToString() {
        const result = cF((boolean : boolean) => boolean.toString(), String)(this);
        return result;
    }
    ValueOf(this : Boolean) {
        const result = cF((boolean : boolean) => boolean.valueOf(), Boolean)(this);
        return result;
    }
};