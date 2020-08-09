import Primitive from "./Primitive";
import Array from "../Object/Array";
import Number from "../Primitive/Number";
import OriginalString from "../Originals/String";
import { S, O, IN } from "../../Changeable/Changeable";
import Function from "./Function";
import cF from "../../Util/cF";
import Boolean from "./Boolean";
import RegExp from "./RegExp";
import OriginalRegExp from "../Originals/RegExp";

export default class String<T extends string> extends Primitive<T> {
    length = cF((string : string) => string.length, Number, true)(this)[IN]();

    CharAt(index : Number) : String<string> {
        const result = cF((string : string, index : number) => string.charAt(index), String)(this, index);
        return result;
    }
    CharCodeAt(index : Number) {
        const result = cF((string : string, index : number) => string.charCodeAt(index), Number)(this, index);
        return result;
    }
    CodePointAt(pos : Number) {
        const result = cF((string : string, pos : number) => string.codePointAt(pos), Number)(this, pos);
        return result;
    }
    Concat(strs : Array<String<string>>) {
        const result = cF((string : string, strs : string[]) => string.concat(...strs), String)(this, Array.FromChangeable(strs));
        return result;
    }
    EndsWith(searchString : String<string>, length = new Number(this[O].length)) {
        const result = cF((string : string, searchString : string, length : number) => string.endsWith(searchString, length), Boolean)(this, searchString, length);
        return result;
    }
    Includes(searchString : String<string>, position = new Number(0)) {
        const result = cF((string : string, searchString : string, position : number) => string.includes(searchString, position), Boolean)(this, searchString, position);
        return result;
    }
    IndexOf(searchValue : String<string>, fromIndex = new Number(0)) {
        const result = cF((string : string, searchValue : string, fromIndex : number) => string.indexOf(searchValue, fromIndex), Number)(this, searchValue, fromIndex);
        return result;
    }
    LastIndexOf(searchValue : String<string>, fromIndex = new Number(Infinity)) {
        const result = cF((string : string, searchValue : string, fromIndex : number) => string.lastIndexOf(searchValue, fromIndex), Number)(this, searchValue, fromIndex);
        return result;
    }
    //localeCompare
    Match(regexp : RegExp) {
        const result = cF((string : string, regexp : OriginalRegExp) => string.match(regexp))(this, regexp);
        return result;
    }
    MatchAll(regexp : RegExp) {
        const result = cF((string : string, regexp : OriginalRegExp) => string.matchAll(regexp))(this, regexp);
        return result;
    }
    Normalize(form = new String("NFC")) {
        const result = cF((string : string, form : string) => string.normalize(form), String)(this, form);
        return result;
    }
    PadEnd(targetLength : Number, padString = new String(" ")) {
        const result = cF((string : string, targetLength : number, padString : string) => string.padEnd(targetLength, padString), String)(this, targetLength, padString);
        return result;
    }
    PadStart(targetLength : Number, padString = new String(" ")) {
        const result = cF((string : string, targetLength : number, padString : string) => string.padStart(targetLength, padString), String)(this, targetLength, padString);
        return result;
    }
    Repeat(count : Number) {
        const result = cF((string : string, count : number) => string.repeat(count), String)(this, count);
        return result;
    }
    Replace(substr : RegExp | String<string>, newSubstr : String<string> | Function<(substring: string, ...args: any[]) => string>) {
        const result = cF((string : string, substr : OriginalRegExp | string, newSubstr : string | ((substring: string, ...args: any[]) => string)) => string.replace(substr, <any>newSubstr), String)(this, substr, newSubstr);
        return result;
    }
    Search(regexp : RegExp) {
        const result = cF((string : string, regexp : OriginalRegExp) => string.search(regexp), Number)(this, regexp);
        return result;
    }
    Slice(beginIndex : Number, endIndex = new Number(this[O].length)) {
        const result = cF((string : string, beginIndex : number, endIndex : number) => string.slice(beginIndex, endIndex), String)(this, beginIndex, endIndex);
        return result;
    }
    Split(separator = new String(undefined), limit = new Number(undefined)) {
        const result = Array.FromPrimitive(cF((string : string, separator : string, limit : number) => string.split(separator, limit))(this, separator, limit));
        return result;
    }
    StartsWith(searchString : String<string>, position = new Number(0)) {
        const result = cF((string : string, searchString : string, position : number) => string.endsWith(searchString, position), Boolean)(this, searchString, position);
        return result;
    }
    Substring(indexStart : Number, indexEnd = new Number(this[O].length)) {
        const result = cF((string : string, indexStart : number, indexEnd : number) => string.substring(indexStart, indexEnd), String)(this, indexStart, indexEnd);
        return result;
    }
    // ToLocaleLowerCase
    // ToLocaleUpperCase
    ToLowerCase() {
        const result = cF((string : string) => string.toLowerCase(), String)(this);
        return result;
    }
    ToString() {
        const result = cF((string : string) => string.toString(), String)(this);
        return result;
    }
    ToUpperCase() {
        const result = cF((string : string) => string.toUpperCase(), String)(this);
        return result;
    }
    Trim() {
        const result = cF((string : string) => string.trim(), String)(this);
        return result;
    }
    TrimEnd() {
        const result = cF((string : string) => string.trimEnd(), String)(this);
        return result;
    }
    TrimRight() {
        return this.TrimEnd();
    }
    TrimStart() {
        const result = cF((string : string) => string.trimStart(), String)(this);
        return result;
    }
    TrimLeft() {
        return this.TrimStart();
    }
    ValueOf() {
        const result = cF((string : string) => string.valueOf(), String)(this);
        return result;
    }

    static FromCharCode(nums : Array<Number>) {
        const result = Array.FromChangeable(nums).Map(new Function(num => OriginalString.fromCharCode(num))).Join(new String(""));
        return result;
    }
    static FromCodePoint(nums : Array<Number>) {
        const result = Array.FromChangeable(nums).Map(new Function(num => OriginalString.fromCodePoint(num))).Join(new String(""));
        return result;
    }
};