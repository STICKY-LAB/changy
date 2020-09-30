import Changeable, { O, C, S } from "../../Changeable/Changeable";
import OriginalObject from "../Originals/Object";
import ChangeEventEmitter from "../../Changeable/ChangeEventEmitter";
import Primitive from "../Primitive/Primitive";
import Array from "./Array";
import Function from "../Primitive/Function";
import OriginalFunction from "../Originals/Function";
import OriginalNumber from "../Originals/Number";
import OriginalString from "../Originals/String";
import cF from "../../Util/cF";

export interface ObjectChangeEventEmitter extends ChangeEventEmitter {
    on(event : "set", listener : (name : PropertyKey, value : any, beforeValue : any, beforeSetted : boolean) => void, output? : Changeable<any>) : this
    on(event : "unset", listener : (name : PropertyKey, value : any) => void) : this
    on(event: string, listener: OriginalFunction): this
    on(event: RegExp, listener: OriginalFunction): this

    emit(event : "set", name : PropertyKey, value : any, beforeValue : any, beforeSetted : boolean) : this
    emit(event : "unset", name : PropertyKey, value : any) : this
    emit(event : string, ...args : any): this
    emit(event : RegExp, ...args : any): this
}

export default class Object_<T extends OriginalObject> extends Changeable<T> {
    readonly [C]: ObjectChangeEventEmitter
    readonly [O]: T

    constructor(original : T) {
        super(original);
        this[C].defineEvents(["set", "unset"]);
    }

    Get<K extends keyof T>(key : Primitive<K>) {
        const result = cF((obj, key) => obj[key])(this, key);
        return result;
    }
    set<K extends keyof T>(name : K, value : T[K]) {
        const beforeValue = (<any>this[O])[name];
        const beforeSetted = OriginalObject.prototype.hasOwnProperty.call(this[O], name);
        const result = ((<any>(this[O]))[name] = value);
        if(beforeValue != value) this[C].emit("set", name, value, beforeValue, beforeSetted);
        return result;
    }
    unset<K extends keyof T>(name : K) {
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
    delete<K extends keyof T>(name : K) {
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

        obj[C].addListeners(objListeners, result);

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

        keys[C].on("splice", keysListener, result);
        obj[C].addListeners(objListeners, result);

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

        keys[C].on("splice", keysListener, result);
        obj[C].addListeners(objListeners, result);

        return result;
    }
    static FromEntries<T>(entries : Array<[keyof T, T[keyof T]]>) {
        const result : Object_<T> = <any> new Object_(OriginalObject.fromEntries(entries[O]));

        const entriesListener = (start : number, deleted : [keyof T, T[keyof T]][], inserted : [keyof T, T[keyof T]][]) => {
            deleted.forEach(deletedEntry => {
                result.unset(deletedEntry[0]);
            });
            inserted.forEach(insertedEntry => {
                result.set(insertedEntry[0], insertedEntry[1]);
            });
        };

        entries[C].on("splice", entriesListener, result);

        return result;
    }

    static FromChangeable<T>(obj : Object_<{[K in keyof T]: Changeable<T[K]>}>)
    {
        const result = new Object_<T>(<any>OriginalObject.fromEntries(OriginalObject.entries(obj[O]).map(([name, value]) => [name, (<any>value)[O]])));

        const valueListenerRemovers : {[name : string]: () => void} = {};
        const addValueListener = (name : keyof T, value : Changeable<T[keyof T]>) => {
            const listener = () => {
                if(value[O] !== (<any>result[O])[name]) {
                    result.set(name, value[O]);
                }
            };
            value[C].on(/^/, listener);
            (<any>valueListenerRemovers)[name] = () => {
                value[C].off(/^/, listener);
                delete (<any>valueListenerRemovers)[name];
            };
        };
        OriginalObject.entries(obj[O]).forEach(([name, value] : [string, Changeable<T[keyof T]>]) => {
            addValueListener(<any>name, value);
        });

        const objListeners = {
            set(name : keyof T, value : Changeable<T[keyof T]>) {
                if((<any>valueListenerRemovers)[name]) (<any>valueListenerRemovers)[name]();
                addValueListener(name, value);
                result.set(name, value[O]);
            },
            unset(name : keyof T) {
                (<any>valueListenerRemovers)[name]();
                result.unset(name);
            }
        };

        obj[C].addListeners(objListeners, result);

        return result;
    }
    static FromPrimitive<T>(primitive : Primitive<T>) {
        const result = new Object_(primitive[O]);
        primitive[C].on("set", (object : T) => {
            Object.keys(result[O]).forEach((key : any) => result.delete(key));
            for(const key in object) result.set(key, object[key]);
        });
        return result;
    }
}