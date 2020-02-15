import Array from "../Array";
import { O, C } from "../../../Changeable";
import OriginalArray from "../OriginalArray";

export default function splice<T>(this : Array<T>, start : number, deleteCount? : number, ...items : T[]) {
    //console.log(items);
    const beforeLength = this[O].length;
    const result = this[O].splice(start, deleteCount, ...items);
    this[C].emit("insert",
        start > beforeLength ? beforeLength : (start < 0 ? beforeLength - start : ((beforeLength + start) < 0 ? 0 : start)),
        result,
        items
    );
    return result;
}