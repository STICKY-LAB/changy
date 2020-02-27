
import ChangeEventEmitter from "./ChangeEventEmitter";

export const C = Symbol("ChangeEventEmitter");
export const O = Symbol("OriginalObject");
export const S = Symbol("StopChange");    //Stop change.

export default abstract class Changeable {
    readonly [C]:ChangeEventEmitter;
    readonly abstract [O]:object;
    [S]:()=>void
    constructor() {
        this[C] = new ChangeEventEmitter;
    }
};