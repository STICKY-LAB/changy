import Changeable, { O } from "../../Changeable/Changeable";
import OriginalObject from "../Originals/Object";

export default class Object_<T extends OriginalObject> extends Changeable<T> {
    readonly [O]: T
}