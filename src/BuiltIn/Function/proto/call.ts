import Function from "../Function";
import Primitive from "../../Primitive/Primitive";
import Changeable, { O, S, C } from "../../../Changeable";
import Array from "../../Array/Array";
import OriginalFunction from "../OriginalFunction";


export default function call(this : Function, thisArg : Primitive<any> = new Primitive(undefined), argsArray : Array<Changeable<any, any>> = new Array()) {
    const result = new Primitive(this[O].value.call(thisArg[O].value, ...argsArray[O].map(arg => arg[O])));

    const listenArg = (arg : Changeable<any,any>) => {
        const listener = () => {
            result.set(this[O].value.call(thisArg[O].value, ...argsArray[O].map(arg => arg[O])));
        };

        arg[C].onAny(listener);
        
        return () => {
            arg[C].offAny(listener);
        };
    };
    const listener = (f : OriginalFunction) => {
        result.set(f.call(thisArg[O].value, ...argsArray[O].map(arg => arg[O])))
    };
    const thisArgListener = (thisArg : any) => {
        result.set(this[O].value.call(thisArg, ...argsArray[O].map(arg => arg[O])));
    };
    const argListenerRemovers : (() => void)[] = [];
    const argsArrayListener = (start : number, deleted : Changeable<any,any>[], inserted : Changeable<any,any>[]) => {
        result.set(this[O].value.call(thisArg[O].value, ...argsArray[O].map(arg => arg[O])));
        argListenerRemovers.splice(start, start + deleted.length, ...inserted.map(arg => listenArg(arg))).forEach(remove => remove());
    };

    this[C].on("set", listener);
    thisArg[C].on("set", thisArgListener);
    argsArray[C].on("insert", argsArrayListener);
    argListenerRemovers.push(...argsArray[O].map(arg => listenArg(arg)));

    result[S] = () => {
        this[C].off("set", listener);
        thisArg[C].off("set", thisArgListener);
        argsArray[C].off("insert", argsArrayListener);
        argListenerRemovers.forEach(remove => remove());
    };

    return result;
}