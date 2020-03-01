import Changeable, { O, C, S } from "../../Changeable/Changeable";
import OriginalObject from "../Originals/Object";
import ChangeEventEmitter from "../../Changeable/ChangeEventEmitter";
import Primitive from "../Primitive/Primitive";

export interface ObjectChangeEventEmitter<T extends OriginalObject> extends ChangeEventEmitter {
    on(event : "set", listener : (name : PropertyKey, value : T[keyof T], beforeValue : T[keyof T], beforeSetted : boolean) => void) : this
    on(event : "unset", listener : (name : PropertyKey, value : T[keyof T]) => void) : this
    on(event: string, listener: Function): this
    on(event: RegExp, listener: Function): this

    emit(event : "set", name : PropertyKey, value : T[keyof T], beforeValue : T[keyof T], beforeSetted : boolean) : this
    emit(event : "unset", name : PropertyKey, value : T[keyof T]) : this
    emit(event : string, ...args : any): this
    emit(event : RegExp, ...args : any): this
}

export default class Object_<T extends OriginalObject> extends Changeable<T> {
    readonly [C]: ObjectChangeEventEmitter<T>
    readonly [O]: T
    get(name : Primitive<PropertyKey>) {
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
}