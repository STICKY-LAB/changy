
import ChangeEventEmitter from "./ChangeEventEmitter";

export const C = Symbol("ChangeEventEmitter");
export const O = Symbol("OriginalObject");
export const S = Symbol("StopChange");    //Stop change.

export default interface Changeable<T, ChangeEventEmitterT extends ChangeEventEmitter> {
    readonly [O]:T,
    readonly [C]:ChangeEventEmitterT,
    [S]:()=>void
};