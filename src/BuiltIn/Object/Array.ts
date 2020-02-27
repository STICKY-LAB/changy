import Changeable, { O, C, S } from "../../Changeable/Changeable";
import OriginalArray from "../Originals/Array";
import ChangeEventEmitter from "../../Changeable/ChangeEventEmitter";
import Primitive from "../Primitive/Primitive";
import Function from "../Primitive/Function";
import Boolean from "../Primitive/Boolean";
import OriginalFunction from "../Originals/Function";

export type ElementCallback<T> = (element : T, index : number, array : T[]) => boolean;

export interface ArrayChangeEventEmitter<T> extends ChangeEventEmitter {
    on(event : "splice", listener : (index : number, deleted : T[], inserted : T[]) => void) : this
    on(event: string, listener: OriginalFunction): this
    on(event: RegExp, listener: OriginalFunction): this

    emit(event : "splice", index : number, deleted : T[], inserted : T[]) : this
    emit(event : string, ...args : any): this
    emit(event : RegExp, ...args : any): this
}

export default class Array<T> extends Changeable {
    readonly [C]: ArrayChangeEventEmitter<T>
    readonly [O]: OriginalArray<T>;
    constructor(arrayLength? : number);
    constructor(...items : T[]);
    constructor(...args : any) {
        super();
        this[O] = new OriginalArray<T>(...args);
    }
    get(index : number) {
        const result = new Primitive<T>(this[O][index]);
        const listener = () => {
            result.set(this[O][index]);
        };
        this[C].on("splice", listener);
        result[S] = () => {
            this[C].off("splice", listener);
        };
        return result;
    }
    set(index : number, value : T) {
        const beforeValue = this[O][index];
        const beforeLength = this[O].length;
        const result = (this[O][index] = value);
        if(beforeLength < this[O].length) { //push
            this[C].emit("splice", beforeLength, [], (new OriginalArray(this[O].length - beforeLength - 1)).concat(value));
        } else { //set
            this[C].emit("splice", index, [beforeValue], [value]);
        }
        return result;
    }

    //Changer
    copyWithin(target : number, start : number = 0, end : number = this[O].length) {
        const start_ = (start < 0 ? this[O].length - start : start);
        const end_ = (end < 0 ? this[O].length - end : end);
        const removed = this[O].slice(target, target + end_ - start_);
        const result = this[O].copyWithin(target, start, end);
        const inserted = this[O].slice(target, target + end_ - start_);
        this[C].emit("splice",
            removed,
            removed,
            inserted
        );
        return result;
    }
    splice(start : number, deleteCount : number, ...items : T[]) {
        const beforeLength = this[O].length;
        const result = this[O].splice(start, deleteCount, ...items);
        this[C].emit("splice",
            start > beforeLength ? beforeLength : (start < 0 ? beforeLength - start : ((beforeLength + start) < 0 ? 0 : start)),
            result,
            items
        );
        return result;
    }
    push(...items : T[]) {
        const beforeLength = this[O].length;
        const result = this[O].push(...items);
        if(beforeLength !== result) {
            this[C].emit("splice",
                beforeLength,
                [],
                items
            );
        }
        return result;
    }

    //Pure
    concat(arrays : Array<Array<any>> = new Array()) {
        const result = new Array(...this[O], ...OriginalArray.prototype.concat(...arrays[O].map(array => array[O])));
        
        const arrayListenerRemovers : (() => void)[] = [];
        const listenArray = (array : Array<any>) => {
            const listener = ((start : number, deleted : any[], items : any[]) => {
                const leftIndex = this[O].length + arrays[O].slice(0, arrays[O].indexOf(array)).reduce((sum, array) => (sum + array[O].length), 0);
                result.splice(leftIndex + start, deleted.length, ...items);
            });
            array[C].on("splice", listener);
            return () => {
                array[C].off("splice", listener);
            };
        }

        const thisListener = ((start : number, deleted : T[], array : T[]) => {
            result.splice(start, deleted.length, ...array);
        });
        const arraysListener = (start : number, deleted : Array<any>[], items : Array<any>[]) => {
            const leftIndex = this[O].length + arrays[O].slice(0, start).reduce((sum, array) => (sum + array[O].length), 0);
            const willDeleteCount = deleted.reduce((sum, array) => (sum + array[O].length), 0);
            result.splice(leftIndex, willDeleteCount, ...OriginalArray.prototype.concat(...items.map(item => item[O])));
            arrayListenerRemovers.splice(start, deleted.length, ...items.map(array => listenArray(array))).forEach(remove => remove());
        };

        arrayListenerRemovers.push(...arrays[O].map(array => listenArray(array)));
        this[C].on("splice", thisListener);
        arrays[C].on("splice", arraysListener);

        result[S] = (() => {
            this[C].off("splice", thisListener);
            arrays[C].off("splice", arraysListener);
            arrayListenerRemovers.forEach(remove => remove());
        });
        return result;
    }
    every(callback : Function<ElementCallback<T>>, thisArg : Primitive<any> = new Primitive(undefined)) {
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
        const callbackListener = (f : ElementCallback<T>) => {
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
}