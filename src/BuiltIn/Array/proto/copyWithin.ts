import Array from "../Array";
import { O, C } from "../../../Changeable";

export default function copyWithin<T>(this : Array<T>, target : number, start : number = 0, end : number = this[O].length) {
    const start_ = (start < 0 ? this[O].length - start : start);
    const end_ = (end < 0 ? this[O].length - end : end);
    const removed = this[O].slice(target, target + end_ - start_);
    const result = this[O].copyWithin(target, start, end);
    const inserted = this[O].slice(target, target + end_ - start_);
    this[C].emit("insert",
        removed,
        removed,
        inserted
    );
    return result;
}