import Changeable, { O, C, S } from "../../Changeable/Changeable";
import OriginalObject from "../Originals/Object";
import ChangeEventEmitter from "../../Changeable/ChangeEventEmitter";
import Primitive from "../Primitive/Primitive";
import Array from "./Array";
import Function from "../Primitive/Function";
import OriginalFunction from "../Originals/Function";
import OriginalNumber from "../Originals/Number";
import OriginalString from "../Originals/String";

export interface ObjectChangeEventEmitter<T extends OriginalObject> extends ChangeEventEmitter {
    on(event : "set", listener : (name : PropertyKey, value : T[keyof T], beforeValue : T[keyof T], beforeSetted : boolean) => void) : this
    on(event : "unset", listener : (name : PropertyKey, value : T[keyof T]) => void) : this
    on(event: string, listener: OriginalFunction): this
    on(event: RegExp, listener: OriginalFunction): this

    emit(event : "set", name : PropertyKey, value : T[keyof T], beforeValue : T[keyof T], beforeSetted : boolean) : this
    emit(event : "unset", name : PropertyKey, value : T[keyof T]) : this
    emit(event : string, ...args : any): this
    emit(event : RegExp, ...args : any): this
}

export default class Object_<T extends OriginalObject> extends Changeable<T> {
    readonly [C]: ObjectChangeEventEmitter<T>
    readonly [O]: T
    Get(name : Primitive<PropertyKey>) {
        const result = new Primitive((<any>this[O])[name[O].value]);

        const listener = () => {
            result.set((<any>this[O])[name[O].value]);
        };
        const nameListener = (name : PropertyKey) => {
            result.set((<any>this[O])[name]);
        };

        this[C].onAny(listener);
        name[C].on("set", nameListener);

        result[S] = () => {
            this[C].offAny(listener);
            name[C].off("set", nameListener);
        };

        return result;
    }
    set(name : PropertyKey, value : T[keyof T]) {
        const beforeValue = (<any>this[O])[name];
        const beforeSetted = OriginalObject.prototype.hasOwnProperty.call(this[O], name);
        const result = ((<any>(this[O]))[name] = value);
        this[C].emit("set", name, value, beforeValue, beforeSetted);
        return result;
    }
    unset(name : PropertyKey) {
        const deleted = (<any>this[O])[name];
        const beforeSetted = OriginalObject.prototype.hasOwnProperty.call(this[O], name);
        const result = delete ((<any>this[O])[name]);
        if(beforeSetted) {
            if(result) {
                this[C].emit("unset", name, deleted);
            }
        }
        return result;
    }
    delete(name : PropertyKey) {
        return this.unset(name);
    }

    static Keys<T>(obj : Object_<T>) {
        const originalKeys = OriginalObject.keys(obj[O]);
        const numbers = new Array(originalKeys.splice(0, originalKeys.findIndex(key => {
            return /^[0-9]+$/.test(key) && (OriginalNumber(key) <= (2**32 - 2));
        })));
        const strings = new Array(originalKeys.splice(0));
        const result = <Array<string>>numbers.Sort(new Function((a, b) => Number(b) < Number(a) ? 1 : -1)).Concat(new Array([strings]));

        const objListeners = {
            set(key : PropertyKey, value : T[keyof T], beforeValue : T[keyof T], beforeSetted : boolean) {
                if((!beforeSetted) && typeof key !== "symbol") {
                    if(/^[0-9]+$/.test(OriginalString(key)) && (OriginalNumber(key) <= (2**32 - 2))) {
                        numbers.push(String(key));
                    } else {
                        strings.push(String(key));
                    }
                }
            },
            unset(key : PropertyKey, value : T[keyof T]) {
                if(typeof key !== "symbol") {
                    if(/^[0-9]+$/.test(OriginalString(key)) && (OriginalNumber(key) <= (2**32 - 2))) {
                        numbers.splice(numbers[O].indexOf(String(key)), 1);
                    } else {
                        strings.splice(strings[O].indexOf(String(key)), 1);
                    }
                }
            }
        };

        obj[C].addListeners(objListeners);

        const prevS = result[S];
        result[S] = () => {
            obj[C].removeListeners(objListeners);
            prevS();
        };

        return result;
    }
    static Values<T>(obj : Object_<T>) {
        const result = new Array(OriginalObject.values(obj[O]));
        const keys = Object_.Keys(obj);
        let lastDeletedKeyIndex : number;

        const keysListener = (start : number, deleted : string[], inserted : string[]) => {
            if(deleted.length) {
                lastDeletedKeyIndex = start;
            }
        };
        const objListeners = {
            set(key : PropertyKey, value : T[keyof T], beforeValue : T[keyof T], beforeSetted : boolean) {
                if(typeof key !== "symbol") {
                    if(!beforeSetted) { //added new value.
                        result.splice(keys[O].indexOf(String(key)), 0, value);
                    } else { //edited value.
                        result.set(keys[O].indexOf(String(key)), value);
                    }
                }
            },
            unset(key : PropertyKey, value : T) {
                if(typeof key !== "symbol") {
                    result.splice(lastDeletedKeyIndex, 1);
                }
            }
        };

        keys[C].on("splice", keysListener);
        obj[C].addListeners(objListeners);

        result[S] = () => {
            keys[S]();
            obj[C].removeListeners(objListeners);
        };

        return result;
    }
    static Entries<T>(obj : Object_<T>) {
        const result = new Array(OriginalObject.entries(obj[O]));
        const keys = Object_.Keys(obj);
        let lastDeletedKeyIndex : number;

        const keysListener = (start : number, deleted : string[], inserted : string[]) => {
            if(deleted.length) {
                lastDeletedKeyIndex = start;
            }
        };
        const objListeners = {
            set(key : PropertyKey, value : any, beforeValue : any, beforeSetted : boolean) {
                if(typeof key !== "symbol") {
                    if(!beforeSetted) { //added new value.
                        result.splice(keys[O].indexOf(String(key)), 0, [String(key), value]);
                    } else { //edited value.
                        result.set(keys[O].indexOf(String(key)), [String(key), value]);
                    }
                }
            },
            unset(key : PropertyKey, value : any) {
                if(typeof key !== "symbol") {
                    result.splice(lastDeletedKeyIndex, 1);
                }
            }
        };

        keys[C].on("splice", keysListener);
        obj[C].addListeners(objListeners);

        result[S] = () => {
            keys[S]();
            obj[C].removeListeners(objListeners);
        };

        return result;
    }
    static FromEntries<T>(entries : Array<[PropertyKey, T[keyof T]]>) {
        const result : Object_<T> = <any> new Object_(OriginalObject.fromEntries(entries[O]));

        const entriesListener = (start : number, deleted : [PropertyKey, T[keyof T]][], inserted : [PropertyKey, T[keyof T]][]) => {
            deleted.forEach(deletedEntry => {
                result.unset(deletedEntry[0]);
            });
            inserted.forEach(insertedEntry => {
                result.set(insertedEntry[0], insertedEntry[1]);
            });
        };

        entries[C].on("splice", entriesListener);

        result[S] = () => {
            entries[C].off("splice", entriesListener);
        };

        return result;
    }
}