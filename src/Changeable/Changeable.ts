
import ChangeEventEmitter from "./ChangeEventEmitter";

export const OC = Symbol("OriginalConstructor");

export const C = Symbol("ChangeEventEmitter");
export const O = Symbol("OriginalObject");
export const S = Symbol("StopChange");    //Stop change.

export default abstract class Changeable<T extends Object> {
    readonly [C]:ChangeEventEmitter;
    readonly abstract [O]:T;
    [S]:()=>void
    constructor(originalObject : T) {
        this[C] = new ChangeEventEmitter;
        this[O] = originalObject;
    }
};