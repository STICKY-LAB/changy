import Changeable, { O, C, OC } from "../../Changeable/Changeable";
import ChangeEventEmitter from "../../Changeable/ChangeEventEmitter";

export class NormalPrimitive<T> {
    value: T;
    constructor(value : T) {
        this.value = value;
    }
    set(value : T) {
        this.value = value;
    }
}

export interface PrimitiveChangeEventEmitter<T> extends ChangeEventEmitter {
    on(event : "set", listener : (value : T) => void) : this
    on(event: string, listener: Function): this
    on(event: RegExp, listener: Function): this

    emit(event : "set", value : T) : this
    emit(event : string, ...args : any): this
    emit(event : RegExp, ...args : any): this
}

class Primitive<T> extends Changeable<NormalPrimitive<T>> {
    readonly [C]: PrimitiveChangeEventEmitter<T>
    readonly [O]: NormalPrimitive<T>
    constructor(value : T) {
        super(new NormalPrimitive(value));
    }
    set(value : T) {
        if(value === this[O].value) return;
        this[O].set(value);
        this[C].emit("set", value);
    }
}

export default Primitive;