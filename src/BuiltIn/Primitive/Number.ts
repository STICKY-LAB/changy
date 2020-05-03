import Primitive from "./Primitive";
import { O, C, S } from "../../Changeable/Changeable";
import String from "./String";
import Object from "../Object/Object";
import OriginalNumber from "../Originals/Number";
import Boolean from "./Boolean";

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
        const result = new String(this[O].toExponential(fractionDigits[O]));
    
        const listener = (value : number) => {
            result.set(value.toExponential(fractionDigits[O]));
        };
        const fractionDigitsListener = (value : number) => {
            result.set(this[O].toExponential(value));
        };
    
        this[C].on("set", listener);
        fractionDigits[C].on("set", fractionDigitsListener);
    
        result[S] = () => {
            this[C].off("set", listener);
            fractionDigits[C].off("set", fractionDigitsListener);
        };
        return result;
    }
    ToFixed(digits : Number = new Number(0)) {
        const result = new String(this[O].toFixed(digits[O]));
        
        const listener = (value : number) => {
            result.set(value.toFixed(digits[O]));
        };
        const digitsListener = (value : number) => {
            result.set(this[O].toFixed(value));
        };
    
        this[C].on("set", listener);
        digits[C].on("set", digitsListener);
    
        result[S] = () => {
            this[C].off("set", listener);
            digits[C].off("set", digitsListener);
        };
        return result;
    }
    ToLocaleString(locales : String<any> = <any> new Primitive(undefined), options : Object<NumberFormatOptions> = <any> new Object(undefined)) {
        const result = new String(this[O].toLocaleString(locales[O], options[O]));
        
        const listener = (value : number) => {
            result.set(value.toLocaleString(locales[O], options[O]));
        };
        const localesListener = (value : string) => {
            result.set(this[O].toLocaleString(value, options[O]));
        };
        const optionsListener = () => {
            result.set(this[O].toLocaleString(locales[O], options[O]))
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
    ToPrecision(precision : Number = <any> new Primitive(undefined)) {
        const result = new String(this[O].toPrecision(precision[O]));
        
        const listener = (value : number) => {
            result.set(value.toPrecision(precision[O]));
        };
        const precisionListener = (value : number) => {
            result.set(this[O].toPrecision(value));
        };
    
        this[C].on("set", listener);
        precision[C].on("set", precisionListener);
    
        result[S] = () => {
            this[C].off("set", listener);
            precision[C].off("set", precisionListener);
        };
    
        return result;
    }
    ToString(radix : Number = <any> new Primitive(undefined)) {
        const result = new String(this[O].toString(radix[O]));
        
        const listener = (value : number) => {
            result.set(value.toString(radix[O]));
        };
        const radixListener = (value : number) => {
            result.set(this[O].toString(value));
        };
    
        this[C].on("set", listener);
        radix[C].on("set", radixListener);
    
        result[S] = () => {
            this[C].off("set", listener);
            radix[C].off("set", radixListener);
        };
    
        return result;
    }
    ValueOf() {
        const result = new Number(this[O]);
        
        const listener = (value : number) => {
            result.set(value);
        };
    
        this[C].on("set", listener);
    
        result[S] = () => {
            this[C].off("set", listener);
        };
    
        return result;
    }

    static IsFinite(value : Number) {
        const result = new Boolean(OriginalNumber.isFinite(value[O]));
    
        const listener = (value : number) => {
            result.set(OriginalNumber.isFinite(value));
        };
    
        value[C].on("set", listener);
    
        result[S] = () => {
            value[C].off("set", listener);
        };
    
        return result;
    }
    static IsInteger(value : Number) {
        const result = new Boolean(OriginalNumber.isInteger(value[O]));
    
        const listener = (value : number) => {
            result.set(OriginalNumber.isInteger(value));
        };
    
        value[C].on("set", listener);
    
        result[S] = () => {
            value[C].off("set", listener);
        };
    
        return result;
    }
    static IsNaN(value : Number) {
        const result = new Boolean(OriginalNumber.isNaN(value[O]));
    
        const listener = (value : number) => {
            result.set(OriginalNumber.isNaN(value));
        };
    
        value[C].on("set", listener);
    
        result[S] = () => {
            value[C].off("set", listener);
        };
    
        return result;
    }
    static IsSafeInteger(value : Number) {
        const result = new Boolean(OriginalNumber.isSafeInteger(value[O]));
    
        const listener = (value : number) => {
            result.set(OriginalNumber.isSafeInteger(value));
        };
    
        value[C].on("set", listener);
    
        result[S] = () => {
            value[C].off("set", listener);
        };
    
        return result;
    }
    static ParseFloat(string : String<any>) {
        const result = new Number(OriginalNumber.parseFloat(string[O]));
    
        const listener = (value : string) => {
            result.set(OriginalNumber.parseFloat(value));
        };
    
        string[C].on("set", listener);
    
        result[S] = () => {
            string[C].off("set", listener);
        };
    
        return result;
    }
    static ParseInt(string : String<any>) {
        const result = new Number(OriginalNumber.parseInt(string[O]));
    
        const listener = (value : string) => {
            result.set(OriginalNumber.parseInt(value));
        };
    
        string[C].on("set", listener);
    
        result[S] = () => {
            string[C].off("set", listener);
        };
    
        return result;
    }
}