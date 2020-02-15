import Primitive from "../../Primitive/Primitive";
import Object from "../Object";
import { O, C, S } from "../../../Changeable";

export default function valueOf(this : Object) {
    const result = new Object(this[O]);
    
    const listeners = {
        set:(prop : PropertyKey, value : any) => {
            (<any>result)[prop] = value;
        },
        unset:(prop : PropertyKey) => {
            delete (<any>result)[prop];
        }
    };

    this[C].addListeners(listeners);

    result[S] = () => {
        this[C].removeListeners(listeners);
    };

    return result;
}