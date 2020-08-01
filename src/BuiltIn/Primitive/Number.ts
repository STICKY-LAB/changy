import Primitive from "./Primitive";
import { O, C, S } from "../../Changeable/Changeable";
import String from "./String";
import Object from "../Object/Object";
import OriginalNumber from "../Originals/Number";
import Boolean from "./Boolean";
import cF from "../../Util/cF";
import cast from "../../Util/cast";

interface NumberFormatOptions {
    localeMatcher?: string;
    style?: string;
    currency?: string;
    currencyDisplay?: string;
    useGrouping?: boolean;
    minimumIntegerDigits?: number;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    minimumSignificantDigits?: number;
    maximumSignificantDigits?: number;
}

export default class Number extends Primitive<number> {
    ToExponential(fractionDigits : Number = <any> new Primitive(undefined)) {
        const result = cF((number : number, fractionDigits : number) => number.toExponential(fractionDigits), String)(this, fractionDigits);
        return result;
    }
    ToFixed(digits : Number = new Number(0)) {
        const result = cF((number : number, digits : number) => number.toFixed(digits), String)(this, digits);
        return result;
    }
    ToLocaleString(locales : String<any> = <any> new Primitive(undefined), options : Object<NumberFormatOptions> = <any> new Object(undefined)) {
        const result = cF((number : number, locales : string, options : NumberFormatOptions) => number.toLocaleString(locales, options), String)(this, locales, options);
        return result;
    }
    ToPrecision(precision : Number = <any> new Primitive(undefined)) {
        const result = cF((number : number, precision : number) => number.toPrecision(precision), String)(this, precision);
        return result;
    }
    ToString(radix : Number = <any> new Primitive(undefined)) {
        const result = cF((number : number, radix : number) => number.toString(radix), String)(this, radix);
        return result;
    }
    ValueOf() {
        const result = cF((number : number) => number.valueOf(), Number)(this);
        return result;
    }

    static IsFinite(value : Number) {
        const result = cF(v => OriginalNumber.isFinite(v), Boolean)(value);
        return result;
    }
    static IsInteger(value : Number) {
        const result = cF(v => OriginalNumber.isInteger(v), Boolean)(value);
        return result;
    }
    static IsNaN(value : Number) {
        const result = cF(v => OriginalNumber.isNaN(v), Boolean)(value);
        return result;
    }
    static IsSafeInteger(value : Number) {
        const result = cF(v => OriginalNumber.isSafeInteger(v), Boolean)(value);
        return result;
    }
    static ParseFloat(string : String<any>) {
        const result = cF(str => parseFloat(str), Number)(string);
        return result;
    }
    static ParseInt(string : String<any>) {
        const result = cF(str => parseInt(str), Number)(string);
        return result;
    }
}