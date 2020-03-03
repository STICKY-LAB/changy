import Primitive from "./Primitive";
import OriginalFunction from "../Originals/Function";
import Array from "../Object/Array";
import String from "../Primitive/String";
import Number from "../Primitive/Number";
import Changeable, { O, C, S } from "../../Changeable/Changeable";

export default class Function<T extends OriginalFunction> extends Primitive<T> {
    length = (() => {
        const result = new Number(this[O].value.length);
    
        const listener = (f : OriginalFunction) => {
            result.set(f.length);
        };
    
        this[C].on("set", listener);
    
        return result;
    })()
    name = (() => {
        const result = new String(this[O].value.name);
    
        const listener = (f : OriginalFunction) => {
            result.set(f.name);
        };
    
        this[C].on("set", listener);
    
        result[S] = () => {
            this[C].off("set", listener);
        };
    
        return result;
    })()
    
    apply(thisArg : Primitive<any>, argsArray : Array<any> = new Array([])) {
        const result = new Primitive(this[O].value.apply(thisArg[O].value, argsArray[O]));
    
        const listener = (f : OriginalFunction) => {
            result.set(f.apply(thisArg[O].value, argsArray[O]));
        };
        const thisListener = (thisArg : any) => {
            result.set(this[O].value.apply(thisArg, argsArray[O]));
        };
        const argsArrayListener = (start : number, deleted : any[], inserted : any[]) => {
            result.set(this[O].value.apply(thisArg[O].value, argsArray[O]));
        };
    
        this[C].on("set", listener);
        thisArg[C].on("set", thisListener);
        argsArray[C].on("insert", argsArrayListener);
    
        result[S] = () => {
            this[C].off("set", listener);
            thisArg[C].off("set", thisListener);
            argsArray[C].off("insert", argsArrayListener);
        };
    
        return result;
    }
    bind(thisArg : Primitive<any>, argsArray : Array<Changeable<any>> = new Array([])) {
        const result = new Function(this[O].value.bind(thisArg[O].value, ...argsArray[O].map(arg => arg[O])));
    
        const listenArg = (arg : Changeable<any>) => {
            const listener = () => {
                result.set(this[O].value.bind(thisArg[O].value, ...argsArray[O].map(arg => arg[O])));
            };
    
            arg[C].onAny(listener);
            
            return () => {
                arg[C].offAny(listener);
            };
        };
        const listener = (f : OriginalFunction) => {
            result.set(f.bind(thisArg[O].value, ...argsArray[O].map(arg => arg[O])))
        };
        const thisArgListener = (thisArg : any) => {
            result.set(this[O].value.bind(thisArg, ...argsArray[O].map(arg => arg[O])));
        };
        const argListenerRemovers : (() => void)[] = [];
        const argsArrayListener = (start : number, deleted : Changeable<any>[], inserted : Changeable<any>[]) => {
            result.set(this[O].value.bind(thisArg[O].value, ...argsArray[O].map(arg => arg[O])));
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
    call<T extends OriginalFunction>(this : Function<T>, thisArg : Primitive<any> = new Primitive(undefined), argsArray : Array<Changeable<any>> = new Array([])) {
        const result = new Primitive(this[O].value.call(thisArg[O].value, ...argsArray[O].map(arg => arg[O])));
    
        const listenArg = (arg : Changeable<any>) => {
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
        const argsArrayListener = (start : number, deleted : Changeable<any>[], inserted : Changeable<any>[]) => {
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
    toString<T extends OriginalFunction>(this : Function<T>) {
        const result = new String(this[O].value.toString());
    
        const listener = (f : OriginalFunction) => {
            result.set(f.toString());
        };
    
        this[C].on("set", listener);
    
        result[S] = () => {
            this[C].off("set", listener);
        };
    
        return result;
    }
}