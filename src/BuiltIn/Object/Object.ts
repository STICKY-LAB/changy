import Changeable, { O } from "../../Changeable/Changeable";
import OriginalObject from "../Originals/Object";

export default class Object_<T extends OriginalObject> extends Changeable {
    readonly [O]: T
    constructor(value : T) {
        super();
        this[O] = value;
    }
}