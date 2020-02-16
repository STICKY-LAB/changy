import Array from "../Array";
import { O, C } from "../../../Changeable";
import OriginalArray from "../OriginalArray";

export default function push<T>(this : Array<T>, ...items : T[]) {
    const beforeLength = this[O].length;
    const result = this[O].push(...items);
    if(beforeLength !== result) {
        this[C].emit("insert",
            beforeLength,
            [],
            items
        );
    }
    return result;
}