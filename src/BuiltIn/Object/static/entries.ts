/*
import Object from "../Object";
import OriginalObject from "../OriginalObject";
import { O, C, S } from "../../../Changeable";
import Array from "../../Array/Array";

const maxIndex = 2**32 - 2;
function isIndex(prop : PropertyKey) {
    const numberProp = Number(prop);
    return Number.isInteger(numberProp) && numberProp >= 0 && numberProp <= maxIndex
}

export default function entries(target : Object) {
    const result = new Array(...OriginalObject.entries(target[O]));
    let numberIndex = result[O].findIndex(([prop_, value]) => );
    
    const listeners = {
        set:(prop : PropertyKey, value : any) => {
            const index = result[O].findIndex(([prop_, value]) => prop === prop_);
            if(index + 1) {
                result[index] = [prop, value];
            } else {
                if(isIndex(index)) {

                } else {

                }
                result.push([prop, value]);
            }
        },
        unset:(prop : PropertyKey) => {
            result.
        }
    };

    target[C].addListeners(listeners);

    result[S] = () => {
        target[C].removeListeners(listeners);
    };

    return result;
}
*/