
import ChangeEventEmitter from "../../ChangeEventEmitter";
import Changeable, { O, C, S } from "../../Changeable";
import Primitive from "../Primitive/Primitive";
import ChangeableClass from "../../ChangeableClass/ChangeableClass";
import OriginalObject from "./OriginalObject";
import hasOwnProperty from "./proto/hasOwnProperty";
import propertyIsEnumerable from "./proto/propertyIsEnumerable";
import toString from "./proto/toString";
import valueOf from "./proto/valueOf";
import assign from "./static/assign";
import Array from "../Array/Array";
import keys from "./static/keys";

export interface ObjectChangeEventEmitter extends ChangeEventEmitter {
    on(event : "set", listener : (prop : PropertyKey, value : any) => void) : this
    on(event : "unset", listener : (prop : PropertyKey) => void) : this
    on(event: string, listener: Function): this
    on(event: RegExp, listener: Function): this

    emit(event : "set", prop : PropertyKey, value : any) : this
    emit(event : "unset") : this
    emit(event : string, ...args : any): this
    emit(event : RegExp, ...args : any): this
}

export class NormalObject {
    constructor(value? : any) {
        const object = new OriginalObject(value);
        OriginalObject.setPrototypeOf(object, null);
        return object;
    }
}

interface ObjectClass extends Changeable<NormalObject, ObjectChangeEventEmitter> {
    [key : string] : any,
    [key : number] : any
    //[key : PropertyKey] : any
};

const proto = {
    hasOwnProperty,
    propertyIsEnumerable,
    toString,
    valueOf
};


//Object, NO SUPPORT PROTOTYPE.
const ObjectClass = ChangeableClass<NormalObject, ObjectChangeEventEmitter>(NormalObject, proto, {
    set(target, prop, value) {
        if(OriginalObject.prototype.hasOwnProperty.call(target[O], prop) && ((<any>target[O])[prop] === value)) return true;
        (<any>target[O])[prop] = value;
        target[C].emit("set", prop, value);
        return true;
    },
    deleteProperty(target, prop) {
        delete (<any>target[O])[prop];
        target[C].emit("unset", prop);
        return true;
    },

    //get
    get(target, prop) {
        let returnValue = new Primitive((<any>target[O])[prop]);
        const listeners = {
            set:(prop_ : PropertyKey, value : any) => {
                if(prop_ === prop) {
                    returnValue.set(value);
                }
            },
            unset(prop_ : PropertyKey) {
                if(prop_ === prop) {
                    returnValue.set(undefined);
                }
            }
        };
        target[C].addListeners(listeners);
        returnValue[S] = () => {
            target[C].removeListeners(listeners);
        }
        return returnValue;
    }
}) as {
    new(value? : any) : ObjectClass,
    proto : typeof proto,
    assign(target : Object, ...sources : object[]) : any,
    keys(target : Object) : Array<string>
};

//Static functions
ObjectClass.assign = assign;
ObjectClass.keys = keys;


export default ObjectClass;