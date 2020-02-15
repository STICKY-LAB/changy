
import ChangeEventEmitter from "../../ChangeEventEmitter";
import Changeable, { O, C, S } from "../../Changeable";
import Primitive from "../Primitive/Primitive";
import ChangeableClass from "../../ChangeableClass/ChangeableClass";
import OriginalArray from "./OriginalArray";
import splice from "./proto/splice";
import concat from "./proto/concat";
import push from "./proto/push";
import copyWithin from "./proto/copyWithin";

//set unset insert.
export interface ArrayChangeEventEmitter<T> extends ChangeEventEmitter {
    on(event : "insert", listener : (start : number, deletedItems : T[], addedItmes : T[]) => void) : this
    on(event: string, listener: Function): this
    on(event: RegExp, listener: Function): this

    emit(event : "insert", start : number, deletedItems : T[], addedItems : T[]) : this
    emit(event : string, ...args : any): this
    emit(event : RegExp, ...args : any): this
}

export class NormalArray<T> extends OriginalArray<T>{};

interface Array<T> extends Changeable<NormalArray<T>, ArrayChangeEventEmitter<T>> {
    [index : number]: any,
    splice: typeof splice,
    push: typeof push,
    concat: typeof concat
};

const proto = {
    concat,
    copyWithin,
    splice,
    push
};


const Array = ChangeableClass<NormalArray<any>, ArrayChangeEventEmitter<any>>(NormalArray, proto, {
    set(target, prop, value) {
        if(Object.prototype.hasOwnProperty.call(target[O], prop) && ((<any>target[O])[prop] === value)) return true;
        const beforeLength = target[O].length;
        const beforeValue = (<any>target[O])[prop];
        (<any>target[O])[prop] = value;
        if(target[O].length > beforeLength) { //Push!
            target[C].emit("insert", beforeLength, [], (new OriginalArray(target[O].length - beforeLength - 1)).concat(value));
        } else {
            target[C].emit("insert", Number(prop), [beforeValue], [value]);
        }
        return true;
    },
    deleteProperty(target, prop) {
        const beforeValue = (<any>target[O])[prop];
        delete (<any>target[O])[prop];
        target[C].emit("insert", prop, [beforeValue], new OriginalArray(1));
        return true;
    },

    //get
    get(target, prop) {
        if(isNaN(Number(prop))) return;
        let returnValue = new Primitive((<any>target[O])[prop]);
        const listeners = {
            insert:() => {
                returnValue.set(target[O][<number>prop]);
            }
        };
        target[C].addListeners(listeners);
        returnValue[S] = () => {
            target[C].removeListeners(listeners);
        }
        return returnValue;
    }
}) as {
    new<T>(elementCount : number) : Array<T>,
    new<T>(...elements : T[]) : Array<T>,
    proto : typeof proto
};

//Static functions


export default Array;