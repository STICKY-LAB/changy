
import ChangeEventEmitter from "../../ChangeEventEmitter";
import Changeable, { O, C } from "../../Changeable";
import ChangeableClass from "../../ChangeableClass/ChangeableClass";
import set from "./proto/set";

export class NormalPrimitive<T> {
    value : T;
    constructor(value : T) {
        this.value = value;
    }
    set(value : T) {
        this.value = value;
    }
};

export interface PrimitiveChangeEventEmitter<T> extends ChangeEventEmitter {
    on(event : "set", listener : (value : T) => void) : this
    on(event: string, listener: Function): this
    on(event: RegExp, listener: Function): this

    emit(event : "set", info : T) : this
    emit(event : string, ...args : any): this
    emit(event : RegExp, ...args : any): this
}

interface Primitive<T> extends Changeable<NormalPrimitive<T>, PrimitiveChangeEventEmitter<T>> {
    set(value : T) : void
};

const proto = {
    set
};

const Primitive = ChangeableClass<NormalPrimitive<any>,PrimitiveChangeEventEmitter<any>>(
    NormalPrimitive,
    proto
) as {
    new<T>(value : T) : Primitive<T>,
    proto : typeof proto
};

export default Primitive;