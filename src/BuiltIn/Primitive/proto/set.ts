import Primitive from "../Primitive";
import { O, C } from "../../../Changeable";

export default function set<T>(this : Primitive<T>, value : T) {
    if(this[O].value === value) return;
    this[O].set(value);
    this[C].emit("set", value);
}