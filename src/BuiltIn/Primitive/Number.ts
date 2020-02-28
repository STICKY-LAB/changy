import Primitive, { NormalPrimitive } from "./Primitive";
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
    toExponential(fractionDigits : Number = <any> new Primitive(undefined)) {
        const result = new String(this[O].value.toExponential(fractionDigits[O].value));
    
        const listener = (value : number) => {
            result.set(value.toExponential(fractionDigits[O].value));
        };
        const fractionDigitsListener = (value : number) => {
            result.set(this[O].value.toExponential(value));
        };
    
        this[C].on("set", listener);
        fractionDigits[C].on("set", fractionDigitsListener);
    
        result[S] = () => {
            this[C].off("set", listener);
            fractionDigits[C].off("set", fractionDigitsListener);
        };
        return result;
    }
    toFixed(digits : Number = new Number(0)) {
        const result = new String(this[O].value.toFixed(digits[O].value));
        
        const listener = (value : number) => {
            result.set(value.toFixed(digits[O].value));
        };
        const digitsListener = (value : number) => {
            result.set(this[O].value.toFixed(value));
        };
    
        this[C].on("set", listener);
        digits[C].on("set", digitsListener);
    
        result[S] = () => {
            this[C].off("set", listener);
            digits[C].off("set", digitsListener);
        };
        return result;
    }
    toLocaleString(locales : String = <any> new Primitive(undefined), options : Object<NumberFormatOptions> = <any> new Object(undefined)) {
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
    toPrecision(precision : Number = <any> new Primitive(undefined)) {
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
    toString(radix : Number = <any> new Primitive(undefined)) {
        const result = new String(this[O].value.toString(radix[O].value));
        
        const listener = (value : number) => {
            result.set(value.toString(radix[O].value));
        };
        const radixListener = (value : number) => {
            result.set(this[O].value.toString(value));
        };
    
        this[C].on("set", listener);
        radix[C].on("set", radixListener);
    
        result[S] = () => {
            this[C].off("set", listener);
            radix[C].off("set", radixListener);
        };
    
        return result;
    }
    valueOf() {
        const result = new Number(this[O].value);
        
        const listener = (value : number) => {
            result.set(value);
        };
    
        this[C].on("set", listener);
    
        result[S] = () => {
            this[C].off("set", listener);
        };
    
        return result;
    }

    static isFinite(value : Number) {
        const result = new Boolean(OriginalNumber.isFinite(value[O].value));
    
        const listener = (value : number) => {
            result.set(OriginalNumber.isFinite(value));
        };
    
        value[C].on("set", listener);
    
        result[S] = () => {
            value[C].off("set", listener);
        };
    
        return result;
    }
    static isInteger(value : Number) {
        const result = new Boolean(OriginalNumber.isInteger(value[O].value));
    
        const listener = (value : number) => {
            result.set(OriginalNumber.isInteger(value));
        };
    
        value[C].on("set", listener);
    
        result[S] = () => {
            value[C].off("set", listener);
        };
    
        return result;
    }
    static isNaN(value : Number) {
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
    static isSafeInteger(value : Number) {
        const result = new Boolean(OriginalNumber.isSafeInteger(value[O].value));
    
        const listener = (value : number) => {
            result.set(OriginalNumber.isSafeInteger(value));
        };
    
        value[C].on("set", listener);
    
        result[S] = () => {
            value[C].off("set", listener);
        };
    
        return result;
    }
    static parseFloat(string : String) {
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
    static parseInt(string : String) {
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
}