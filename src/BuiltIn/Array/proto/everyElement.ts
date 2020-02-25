import Array from "../Array";
import Function from "../../Function/Function";
import Primitive from "../../Primitive/Primitive";
import Boolean from "../../Boolean/Boolean";
import { O, C, S } from "../../../Changeable";


type Callback<T> = (element : T) => boolean;

export default function everyElement<T>(
    this : Array<T>,
    callback : Function<Callback<T>>,
    thisArg : Primitive<any> = new Primitive(undefined)
) {
    const result = new Boolean(this[O].every(callback[O].value, thisArg[O].value));

    const listener = (start : number, deleted : T[], inserted : T[]) => {
        if(result[O].value) {
            result.set(inserted.every(callback[O].value, thisArg[O].value));
        } else {
            if(!deleted.every(callback[O].value)) {
                result.set(this[O].every(callback[O].value, thisArg[O].value));
            }
        }
        result.set(this[O].every(callback[O].value, thisArg[O].value));
    };
    const callbackListener = (f : Callback<T>) => {
        result.set(this[O].every(f, thisArg[O].value));
    };
    const thisArgListener = (thisArg : any) => {
        result.set(this[O].every(callback[O].value, thisArg));
    };

    this[C].on("insert", listener);
    callback[C].on("set", callbackListener);
    thisArg[C].on("set", thisArgListener);

    result[S] = () => {
        this[C].off("insert", listener);
        callback[C].off("set", callbackListener);
        thisArg[C].on("set", thisArgListener);
    };

    return result;
}