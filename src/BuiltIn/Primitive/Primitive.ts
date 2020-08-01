import Changeable, { O, C, S } from "../../Changeable/Changeable";
import ChangeEventEmitter from "../../Changeable/ChangeEventEmitter";
import Boolean from "./Boolean";

export interface PrimitiveChangeEventEmitter<T> extends ChangeEventEmitter {
    on(event : "set", listener : (value : T, prevValue : T) => void, output : Changeable<any>) : this
    on(event: string, listener: Function): this
    on(event: RegExp, listener: Function): this

    emit(event : "set", value : T, prevValue : T) : this
    emit(event : string, ...args : any): this
    emit(event : RegExp, ...args : any): this
}

class Primitive<T> extends Changeable<T> {
    readonly [C]: PrimitiveChangeEventEmitter<T>
    [O]: T
    constructor(value : T) {
        super(value);
        this[C].defineEvents(["set"]);
    }
    set(value : T) {
        const prevValue = this[O];
        if(value === prevValue) return;
        this[O] = value;
        this[C].emit("set", value, prevValue);
    }
}

export default Primitive;