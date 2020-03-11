
import ChangeEventEmitter from "./ChangeEventEmitter";

export const C = Symbol("ChangeEventEmitter");
export const O = Symbol("OriginalObject");
export const S = Symbol("StopChange");    //Stop change.
const Ss = Symbol("StopChangeCallbacks");

/**
 * # 변화 중지가 필요한 이유
 * 1. 말그대로 변화 중지를 위해
 * 2. 참조 끊기
 * 
 * 객체에 콜백이 걸렸거나 객체가 다른 곳에 콜백을 걸었을 때,
 * 이벤트 콜백을 삭제하기 전까지는 콜백들이 참조하는 객체들은 사라질 수 없습니다.
 * 
 * A를 Map해서 B를 생성 했을 때, 만약 B의 변화 중지가 불가능하다면
 * B가 더이상 변경되지 않음에도 A에 걸려있는 이벤트 콜백 때문에
 * B는 여전히 존재하고 있게 됩니다.
 * 
 * 배열 A의 length를 B라 했을 때, 만약 A의 변화 중지가 불가능하다면
 * A는 더이상 변경되지 않음에도 A에 걸려있는 이벤트 콜백 때문에
 * B는 여전히 존재하고 있게 됩니다.
 * 
 * 심각하게 중요한 부분은 아닙니다.
 */

 /**
  * 
  */

export default abstract class Changeable<T> {
    readonly [C] = new ChangeEventEmitter
    readonly [Ss] : (() => void)[] = [() => {
        //remove all listeners
        this[C].removeAllListeners(/^/);
        this[C].anyListeners.forEach(anyListener => this[C].offAny(anyListener));
    }];
    abstract [O]:T;
    constructor(originalObject : T) {
        this[O] = originalObject;
    }
    set [S](callback : () => void) {
        this[Ss].push(callback);
    }
    get [S]() {
        return () => {
            this[Ss].splice(0).forEach(stop => stop());
        };
    }
};