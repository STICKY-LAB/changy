import Primitive from "./Primitive";
import OriginalRegExp from "../Originals/RegExp";
import { cF } from "../..";
import { IN } from "../../Changeable/Changeable";
import Boolean from "./Boolean";
import String from "./String";

// # RegExp는 Primitive다!
// exec의 사용은 바람직하지 못하다.
// RegExp는 데이터가 아니며, exec은 순차지향적이다.

export default class RegExp extends Primitive<OriginalRegExp> {
    dotAll = cF((regExp : OriginalRegExp) => regExp.dotAll, Boolean, true)(this)[IN]();
    flags = cF((regExp : OriginalRegExp) => regExp.flags, String, true)(this)[IN]();
    global = cF((regExp : OriginalRegExp) => regExp.global, Boolean, true)(this)[IN]();
    ignoreCase = cF((regExp : OriginalRegExp) => regExp.ignoreCase, Boolean, true)(this)[IN]();
    multiline = cF((regExp : OriginalRegExp) => regExp.multiline, Boolean, true)(this)[IN]();
    source = cF((regExp : OriginalRegExp) => regExp.source, String, true)(this)[IN]();
    sticky = cF((regExp : OriginalRegExp) => regExp.sticky, Boolean, true)(this)[IN]();
    unicode = cF((regExp : OriginalRegExp) => regExp.unicode, Boolean, true)(this)[IN]();

    Test(str : String<string>) {
        const result = cF((regexp : OriginalRegExp, str : string) => regexp.test(str), Boolean)(this, str);
        return result;
    }
}