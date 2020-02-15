import Primitive from "../../Primitive/Primitive";
import Object from "../Object";
import { O, C, S } from "../../../Changeable";
import OriginalObject from "../OriginalObject";

export default function propertyIsEnumerable(this : Object, prop : Primitive<PropertyKey>) : Primitive<boolean> {
    const result = new Primitive(OriginalObject.prototype.propertyIsEnumerable.call(this[O], prop[O].value));
    const listeners = {
        set:(prop_ : PropertyKey) => {
            if(prop[O].value === prop_) {
                result.set(OriginalObject.prototype.propertyIsEnumerable.call(this[O], prop_));
            }
        },
        unset:(prop_ : PropertyKey) => {
            if(prop[O].value === prop_) {
                result.set(false);
            }
        }
    };
    const propListeners = {
        set:(value : PropertyKey) => {
            result.set(OriginalObject.prototype.propertyIsEnumerable.call(this[O], value));
        }
    };
    this[C].addListeners(listeners);
    prop[C].addListeners(propListeners);
    result[S] = () => {
        this[C].removeListeners(listeners);
        prop[C].removeListeners(propListeners);
    };
    return result;
}