
import ChangeEventEmitter from "./ChangeEventEmitter";

export const C = Symbol("ChangeEventEmitter");
export const O = Symbol("OriginalObject");
export const S = Symbol("StopChange");
export const IN = Symbol("In");
export const OUT = Symbol("Out");

export default abstract class Changeable<T> {
    abstract [O] : T;
    readonly [C] = new ChangeEventEmitter;
    constructor(originalObject : T) {
        this[O] = originalObject;
    }
    [S]() {
        this[C].stop();
    }
    [IN]() {
        this[C].in = true;
        return this;
    }
    [OUT]() {
        this[C].out = true;
        return this;
    }
};