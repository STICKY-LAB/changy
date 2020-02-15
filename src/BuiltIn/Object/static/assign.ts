import Object from "../Object";
import OriginalObject from "../OriginalObject";
import { O } from "../../../Changeable";

export default function assign(target : Object, ...sources : object[]) {
    return OriginalObject.assign(target, ...sources);
}