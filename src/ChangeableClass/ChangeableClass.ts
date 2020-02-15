import ChangeEventEmitter from "../ChangeEventEmitter";
import { O, C, S } from "../Changeable";
import { Changeable } from "..";

export const Change = Symbol("ChangeFunction");
export const Target = Symbol("Target");

export interface ChangeableClassHandler<T extends object> {
    //Changer
    set? (target: T, p: PropertyKey, value: any, receiver: any): boolean;
    deleteProperty? (target: T, p: PropertyKey): boolean;

    //No-Changer
    get? (target: T, p: PropertyKey, receiver: any): Changeable<any, any>;
    apply? (target: T, thisArg: any, argArray?: any): Changeable<any, any>;
    construct? (target: T, argArray: any, newTarget?: any): Changeable<any, any>;
}

/*
# Changeable with handler supports those syntaxs:
get       - changeable[prop];
set       - changeable[prop] = value;
delete    - delete changeable[prop];
apply     - changeable(...)
construct - new changeable(...)

# Changeable without handler supports those syntaxs ONLY FOR SPECIFIED PROPERTIES :
get       - changeable[prop];
set       - changeable[prop] = value;

*/


export interface ChangeableClass<T, ChangeEventEmitterT extends ChangeEventEmitter, Prototype> {
    new(...args : any[]) : Changeable<T, ChangeEventEmitterT>,
    proto: Prototype
}

export default function ChangeableClass<T extends object, ChangeEventEmitterT extends ChangeEventEmitter>(
    targetClass : {new(...args : any[]) : T},
    prototype : any,                                     
    handler? : ChangeableClassHandler<{[O]:T,[C]:ChangeEventEmitterT,[S]:()=>void}>
) : ChangeableClass<T, ChangeEventEmitterT, typeof prototype> {
    //const prototype = getPrototype(changeEventEmitter.emit.bind(changeEventEmitter), target);
    if(handler) {
        const result : ChangeableClass<T, ChangeEventEmitterT, typeof prototype> = <any> class {
            constructor(...args : any[]) {
                const target = new targetClass(...args);
                const changeEventEmitter = <ChangeEventEmitterT> new ChangeEventEmitter;
                const object = {
                    [O]:target,
                    [C]:changeEventEmitter,
                    [S]:() => {}
                };
                Object.setPrototypeOf(object, prototype);
                const proxied = new Proxy(object, {
                    ...handler,
                    get(target, prop, receiver) {
                        if(prop === O) return target[O];
                        if(prop === C) return target[C];
                        if(prop === S) return target[S];
                        
                        const result = handler.get(target, prop, receiver);
                        if(!result) {
                            return (<any>target)[prop];
                        }
                        return result;
                    },
                    set(target, prop, value, receiver) {
                        if(prop === O) return false;
                        if(prop === C) return false;
                        if(prop === S) {
                            target[S] = value;
                            return true;
                        }

                        return handler.set(target, prop, value, receiver);
                    },

                    defineProperty() {
                        throw Error("You can't use defineProperty with Changeable.");
                    },
                    preventExtensions() {
                        throw Error("You can't use preventExtensions with Changeable.");
                    },
                    setPrototypeOf() {
                        throw Error("You can't use setPrototypeOf with Changeable.");
                    },
                    getPrototypeOf() {
                        throw Error("You can't use built-in getPrototypeOf with Changeable.");
                    },
                    getOwnPropertyDescriptor() {
                        throw Error("You can't use built-in getOwnPropertyDescriptor with Changeable.");
                    },
                    has() {
                        throw Error("You can't use in operator with Changeable.");
                    },
                    isExtensible() {
                        throw Error("You can't use built-in isExtensible with Changeable.");
                    },
                    ownKeys() {
                        throw Error("You can't use built-in ownKeys with Changeable.");
                    }
                });
                return proxied;
            }
        };
        result.proto = prototype;
        return result;
    } else {
        const result = <any> class {
            constructor(...args : any[]) {
                const target = new targetClass(...args);
                const changeEventEmitter = <ChangeEventEmitterT> new ChangeEventEmitter;
                const object = {
                    [O]:target,
                    [C]:changeEventEmitter,
                    [S]:() => {}
                };
                Object.setPrototypeOf(object, prototype);
                return object;
            }
        };
        result.proto = prototype;
        return result;
    }
}