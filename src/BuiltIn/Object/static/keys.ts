/*

import OriginalObject from "../OriginalObject";
import Object from "../Object";
import { O } from "../../../Changeable";
import Array from "../../Array/Array";

const maxIndex = 2**32 - 2;
function isIndex(prop : PropertyKey) {
    const numberProp = Number(prop);
    return Number.isInteger(numberProp) && numberProp >= 0 && numberProp <= maxIndex
}

export default function entries(target : Object) {
    const result = new Array(...OriginalObject.keys(target[O]));
    let stringIndex = result[O].findIndex(prop => !isIndex(prop));
    if(stringIndex === -1) stringIndex = result[O].length;
    
    const listeners = {
        set:(prop : PropertyKey, value : any) => {
            const index = result[O].findIndex(([prop_, value]) => prop === prop_);
            if(index + 1) {
                result[index] = String(prop);
            } else {
                if(isIndex(prop)) { //number index
                    result.splice(Math.min(0, result[O].findIndex(key => Number(key) > Number(prop))), 0, prop);
                    stringIndex++;
                } else {            //not number index
                    result.splice(result[O].findIndex(stringIndex))
                }
                result.push([prop, value]);
            }
        },
        unset:(prop : PropertyKey) => {
            if(isIndex(prop)) {

            }
        }
    };

    target[C].addListeners(listeners);

    result[S] = () => {
        target[C].removeListeners(listeners);
    };

    return result;
}
*/