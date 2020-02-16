

import OriginalObject from "../OriginalObject";
import Object from "../Object";
import { O, S, C } from "../../../Changeable";
import Array from "../../Array/Array";

const maxIndex = 2**32 - 2;
function isIndex(prop : PropertyKey) {
    const numberProp = Number(prop);
    return Number.isInteger(numberProp) && numberProp >= 0 && numberProp <= maxIndex
}

export default function keys(target : Object) {
    const result = new Array(...OriginalObject.keys(target[O]));
    let stringIndex = result[O].findIndex(prop => !isIndex(prop));
    if(stringIndex === -1) stringIndex = result[O].length;
    
    const listeners = {
        set:(prop : PropertyKey, value : any) => {
            if(typeof prop === "symbol") return;
            const index = result[O].findIndex(([prop_, value]) => prop === prop_);
            if(index + 1) {
                result[index] = String(prop);
            } else {
                if(isIndex(prop)) { //number index
                    const indexToSplice = result[O].findIndex(key => Number(key) > Number(prop));
                    result.splice((indexToSplice + 1) ? indexToSplice : stringIndex, 0, String(prop));
                    stringIndex++;
                } else {            //not number index
                    result.splice(result[O].length, 0, String(prop));
                }
            }
        },
        unset:(prop : PropertyKey) => {
            result.splice(result[O].findIndex(key => key === prop),1);
            if(isIndex(prop)) {
                stringIndex--;
            }
        }
    };

    target[C].addListeners(listeners);

    result[S] = () => {
        target[C].removeListeners(listeners);
    };

    return result;
}
