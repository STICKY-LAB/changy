import Changeable, { O, C, S } from "../../Changeable/Changeable";
import OriginalArray from "../Originals/Array";
import ChangeEventEmitter from "../../Changeable/ChangeEventEmitter";
import Primitive from "../Primitive/Primitive";
import Function from "../Primitive/Function";
import Boolean from "../Primitive/Boolean";
import OriginalFunction from "../Originals/Function";
import Number from "../Primitive/Number";
import String from "../Primitive/String";

/**
 * Don't make empty element.
 * It doesn't support empty element.
 */

export function realIndex(index : number, length : number) {
    return index < 0 ? (index < -length ? 0 : length + index) : (index > length ? length : index);
}
export function changeableRealIndex(index : Number, length : Number) {
    const result = new Number(index[O].value < 0 ? (index[O].value < -length ? 0 : length[O].value + index[O].value) : (index[O].value > length[O].value ? length[O].value : index[O].value));

    const indexListener = (index : number) => {
        result.set(index < 0 ? (index < -length ? 0 : length[O].value + index) : (index > length[O].value ? length[O].value : index));
    };

    const lengthListener = (length : number) => {
        result.set(index[O].value < 0 ? (index[O].value < -length ? 0 : length + index[O].value) : (index[O].value > length ? length : index[O].value));
    }

    index[C].on("set", indexListener);
    length[C].on("set", lengthListener);

    result[S] = () => {
        index[C].off("set", indexListener);
        length[C].off("set", lengthListener);
    };

    return result;
}

export type ElementCallback<T, R> = (element : T, index: number, array: T[]) => R;
export type PureElementCallback<T, R> = (element : T) => R;
export type ReduceCallback<T, R> = (accumulator : R, element : T, index : number, array : T[]) => R
export type PureReduceCallback<T, R> = (accumulator : R, element : T) => R

export interface ArrayChangeEventEmitter<T> extends ChangeEventEmitter {
    on(event : "splice", listener : (index : number, deleted : T[], inserted : T[]) => void) : this
    on(event: string, listener: OriginalFunction): this
    on(event: RegExp, listener: OriginalFunction): this

    emit(event : "splice", index : number, deleted : T[], inserted : T[]) : this
    emit(event : string, ...args : any): this
    emit(event : RegExp, ...args : any): this
}

export default class Array<T> extends Changeable<OriginalArray<T>> {
    readonly [C]: ArrayChangeEventEmitter<T>
    readonly [O]: OriginalArray<T>;
    get(index : Number) {
        const result = new Primitive<T>(this[O][index[O].value]);
        const listener = () => {
            result.set(this[O][index[O].value]);
        };
        const indexListener = (index : number) => {
            result.set(this[O][index]);
        };

        this[C].on("splice", listener);
        index[C].on("set", indexListener);

        result[S] = () => {
            this[C].off("splice", listener);
            index[C].off("set", indexListener);
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
        const start_ = realIndex(start, this[O].length);
        const end_ = realIndex(end, this[O].length);
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
    fill(value : T, start : number = 0, end : number = this[O].length) {
        const deleted = this[O].slice(start, end);
        const result = this[O].fill(value, start, end);
        const inserted = this[O].slice(start, end);
        this[C].emit("splice",
            realIndex(start, this[O].length),
            deleted,
            inserted
        );
        return result;
    }
    pop() {
        const beforeLength = this[O].length;
        const result = this[O].pop();
        if(beforeLength) {
            this[C].emit("splice", beforeLength - 1, [result], []);
        }
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
    splice(start : number, deleteCount? : number, ...items : T[]) {
        if(deleteCount === 0 && items.length === 0) return [];
        const beforeLength = this[O].length;
        const result = deleteCount ? this[O].splice(start, deleteCount, ...items) : this[O].splice(start);
        this[C].emit("splice",
            realIndex(start, beforeLength),
            result,
            items
        );
        return result;
    }

    //Pure
    concat(arrays : Array<Array<any>> = new Array([])) {
        const result = new Array([...this[O], ...OriginalArray.prototype.concat(...arrays[O].map(array => array[O]))]);
        
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
    impureEvery(callback : Function<ElementCallback<T, boolean>>, thisArg : Primitive<any> = new Primitive(undefined)) {
        const result = new Boolean(this[O].every(<any>callback[O].value, thisArg[O].value));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            result.set(this[O].every(callback[O].value, thisArg[O].value));
        };
        const callbackListener = (f : ElementCallback<T, boolean>) => {
            result.set(this[O].every(f, thisArg[O].value));
        };
        const thisArgListener = (thisArg : any) => {
            result.set(this[O].every(callback[O].value, thisArg));
        };
    
        this[C].on("splice", listener);
        callback[C].on("set", callbackListener);
        thisArg[C].on("set", thisArgListener);
    
        result[S] = () => {
            this[C].off("splice", listener);
            callback[C].off("set", callbackListener);
            thisArg[C].on("set", thisArgListener);
        };
    
        return result;
    }
    every(callback : Function<PureElementCallback<T, boolean>>) {
        let callbackResults = this[O].map(callback[O].value);
        const result = new Boolean(callbackResults.every(isPassed => isPassed));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            const callbackResults_inserted = inserted.map(callback[O].value);
            const callbackResults_deleted = callbackResults.splice(start, deleted.length, ...callbackResults_inserted);
            
            if(result[O].value) {
                result.set(callbackResults_inserted.every(isPassed => isPassed));
            } else {
                if(!callbackResults_deleted.every(isPassed => isPassed)) {
                    if(callbackResults_inserted.every(isPassed => isPassed)) {
                        result.set(callbackResults.every(isPassed => isPassed));
                    }
                }
            }
        };
        const callbackListener = (f : PureElementCallback<T, boolean>) => {
            callbackResults = this[O].map(f);
            result.set(callbackResults.every(isPassed => isPassed));
        };
    
        this[C].on("splice", listener);
        callback[C].on("set", callbackListener);
    
        result[S] = () => {
            this[C].off("splice", listener);
            callback[C].off("set", callbackListener);
        };
    
        return result;
    }
    impureFilter(callback : Function<ElementCallback<T, boolean>>, thisArg : Primitive<any> = new Primitive(undefined)) {
        const result = new Array(this[O].filter(<any>callback[O].value, thisArg[O].value));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            result.splice(0, result[O].length, ...this[O].filter(callback[O].value, thisArg[O].value));
        };
        const callbackListener = (f : ElementCallback<T, boolean>) => {
            result.splice(0, result[O].length, ...this[O].filter(f, thisArg[O].value));
        };
        const thisArgListener = (thisArg : any) => {
            result.splice(0, result[O].length, ...this[O].filter(callback[O].value, thisArg));
        };
    
        this[C].on("splice", listener);
        callback[C].on("set", callbackListener);
        thisArg[C].on("set", thisArgListener);
    
        result[S] = () => {
            this[C].off("splice", listener);
            callback[C].off("set", callbackListener);
            thisArg[C].on("set", thisArgListener);
        };
    
        return result;
    }
    filter(callback : Function<PureElementCallback<T, boolean>>) {
        let callbackResults = this[O].map(callback[O].value);
        const result = new Array(this[O].filter((element, index) => callbackResults[index]));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            const callbackResults_inserted = inserted.map(callback[O].value);
            const resultStart = callbackResults.slice(0, start)
                .reduce((sum, isPassed) => sum + <number><unknown>isPassed, 0);
            const resultDeleteCount = callbackResults.splice(start, deleted.length, ...callbackResults_inserted)
                .reduce((sum, isPassed) => sum + <number><unknown>isPassed, 0);
            result.splice(resultStart, resultDeleteCount, ...inserted.filter((element, index) => callbackResults_inserted[index]));
        };
        const callbackListener = (f : ElementCallback<T, boolean>) => {
            callbackResults = this[O].map(f);
            result.splice(0, result[O].length, ...this[O].filter((element, index) => callbackResults[index]));
        };
    
        this[C].on("splice", listener);
        callback[C].on("set", callbackListener);
    
        result[S] = () => {
            this[C].off("splice", listener);
            callback[C].off("set", callbackListener);
        };
    
        return result;
    }
    impureFind(callback : Function<ElementCallback<T, boolean>>, thisArg : Primitive<any> = new Primitive(undefined)) {
        const result = new Primitive(this[O].find(callback[O].value, thisArg[O].value));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            result.set(this[O].find(callback[O].value, thisArg[O].value));
        };
        const callbackListener = (f : ElementCallback<T, boolean>) => {
            result.set(this[O].find(f, thisArg[O].value));
        };
        const thisArgListener = (thisArg : any) => {
            result.set(this[O].find(callback[O].value, thisArg));
        };
    
        this[C].on("splice", listener);
        callback[C].on("set", callbackListener);
        thisArg[C].on("set", thisArgListener);
    
        result[S] = () => {
            this[C].off("splice", listener);
            callback[C].off("set", callbackListener);
            thisArg[C].on("set", thisArgListener);
        };
    
        return result;
    }
    find(callback : Function<PureElementCallback<T, boolean>>) {
        const index = this.findIndex(callback);
        const result = this.get(index);
    
        result[S] = () => {
            index[S]();
            result[S]();
        };
    
        return result;
    }
    impureFindIndex(callback : Function<ElementCallback<T, boolean>>, thisArg : Primitive<any> = new Primitive(undefined)) {
        const result = new Number(this[O].findIndex(callback[O].value, thisArg[O].value));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            result.set(this[O].findIndex(callback[O].value, thisArg[O].value));
        };
        const callbackListener = (f : ElementCallback<T, boolean>) => {
            result.set(this[O].findIndex(f, thisArg[O].value));
        };
        const thisArgListener = (thisArg : any) => {
            result.set(this[O].findIndex(callback[O].value, thisArg));
        };
    
        this[C].on("splice", listener);
        callback[C].on("set", callbackListener);
        thisArg[C].on("set", thisArgListener);
    
        result[S] = () => {
            this[C].off("splice", listener);
            callback[C].off("set", callbackListener);
            thisArg[C].on("set", thisArgListener);
        };
    
        return result;
    }
    findIndex(callback : Function<PureElementCallback<T, boolean>>) {
        let callbackResults = this[O].map(callback[O].value);
        const result = new Number(this[O].findIndex((element, index) => callbackResults[index]));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            const callbackResults_inserted = inserted.map(callback[O].value);
            const callbackResults_deleted = callbackResults.splice(start, deleted.length, ...callbackResults_inserted);
            if(this[O].length) {
                if(result[O].value === -1) {
                    const index = callbackResults_inserted.findIndex(isPassed => isPassed);
                    if(index !== -1) {
                        result.set(start + index);
                    }
                } else {
                    if(result[O].value >= start) {
                        const index = callbackResults_inserted.findIndex(isPassed => isPassed);
                        if(index !== -1) {
                            result.set(start + index);
                        } else {
                            if(callbackResults_deleted.findIndex(isPassed => isPassed) !== -1) {
                                result.set(callbackResults.findIndex(isPassed => isPassed));
                            }
                        }
                    }
                }
            } else {
                result.set(-1);
            }
        };
        const callbackListener = (f : PureElementCallback<T, boolean>) => {
            callbackResults = this[O].map(f);
            result.set(this[O].findIndex((element, index) => callbackResults[index]));
        };
    
        this[C].on("splice", listener);
        callback[C].on("set", callbackListener);
    
        result[S] = () => {
            this[C].off("splice", listener);
            callback[C].off("set", callbackListener);
        };
    
        return result;
    }
    // flat(depth : Number = new Number(1)) { //NOT COMPLETE
    //     if(depth[O].value >= 1) {

    //     }
    // }
    // flatMap() { //NOT COMPLETE

    // }
    includes(valueToFind : Primitive<T>, fromIndex_ : Number = new Number(0)) {
        const result = new Boolean(this[O].includes(valueToFind[O].value, fromIndex_[O].value));
        const length = this.length;
        const fromIndex = changeableRealIndex(fromIndex_, length);
        let beforeFromIndex = fromIndex[O].value;

        const listener = (start : number, deleted : T[], inserted : T[]) => {
            if(!result[O].value) {
                result.set(inserted.includes(valueToFind[O].value, fromIndex[O].value));
            } else {
                if(deleted.includes(valueToFind[O].value)) {
                    if(!inserted.includes(valueToFind[O].value)) {
                        result.set(this[O].includes(valueToFind[O].value, fromIndex[O].value));
                    }
                }
            }
        };
        const valueToFindListener = (valueToFind : T) => {
            result.set(this[O].includes(valueToFind, fromIndex[O].value));
        };
        const fromIndexListener = (fromIndex : number) => {
            if(!result[O].value) {
                if(fromIndex < beforeFromIndex) {
                    result.set(this[O].includes(valueToFind[O].value, fromIndex));
                }
            } else {
                if(fromIndex > beforeFromIndex) {
                    result.set(this[O].includes(valueToFind[O].value, fromIndex));
                }
            }
            beforeFromIndex = fromIndex;
        };

        this[C].on("splice", listener);
        valueToFind[C].on("set", valueToFindListener);
        fromIndex[C].on("set", fromIndexListener);

        result[S] = () => {
            length[S]();
            fromIndex[S]();
            this[C].off("splice", listener);
            valueToFind[C].off("set", valueToFindListener);
            fromIndex[C].off("set", fromIndexListener);
        };
        return result;
    }
    indexOf(searchElement : Primitive<T>, fromIndex_ : Number = new Number(0)) {
        const result = new Number(this[O].indexOf(searchElement[O].value, fromIndex_[O].value));
        const length = this.length;
        const fromIndex = changeableRealIndex(fromIndex_, length);
        let beforeFromIndex = fromIndex[O].value;

        const listener = (start : number, deleted : T[], inserted : T[]) => {
            if(result[O].value === -1) {
                result.set(inserted.indexOf(searchElement[O].value, fromIndex[O].value));
            } else {
                if(deleted.includes(searchElement[O].value)) {
                    if(!inserted.includes(searchElement[O].value)) {
                        result.set(this[O].indexOf(searchElement[O].value, fromIndex[O].value));
                    }
                }
            }
        };
        const searchElementListener = (searchElement : T) => {
            result.set(this[O].indexOf(searchElement, fromIndex[O].value));
        };
        const fromIndexListener = (fromIndex : number) => {
            if(result[O].value === -1) {
                if(fromIndex < beforeFromIndex) {
                    result.set(this[O].indexOf(searchElement[O].value, fromIndex));
                }
            } else {
                if(fromIndex > beforeFromIndex) {
                    result.set(this[O].indexOf(searchElement[O].value, fromIndex));
                }
            }
            beforeFromIndex = fromIndex;
        };

        this[C].on("splice", listener);
        searchElement[C].on("set", searchElementListener);
        fromIndex[C].on("set", fromIndexListener);

        result[S] = () => {
            length[S]();
            fromIndex[S]();
            this[C].off("splice", listener);
            searchElement[C].off("set", searchElementListener);
            fromIndex[C].off("set", fromIndexListener);
        };
        return result;
    }
    join(separator : String = new String("")) { //efficiency not good. I think we need "ArrayString" class.
        const result = new String(this[O].join(separator[O].value));

        const listener = () => {
            result.set(this[O].join(separator[O].value));
        };
        const separatorListener = (separator : string) => {
            result.set(this[O].join(separator));
        };

        this[C].on("splice", listener);
        separator[C].on("set", separatorListener);

        result[S] = () => {
            this[C].off("splice", listener);
            separator[C].off("set", separatorListener);
        };

        return result;
    }
    //lastIndexOf
    impureMap<R>(callback : Function<ElementCallback<T, R>>, thisArg : Primitive<any> = new Primitive(undefined)) {
        const result = new Array(this[O].map(<any>callback[O].value, thisArg[O].value));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            result.splice(0, result[O].length, ...this[O].map(callback[O].value, thisArg[O].value));
        };
        const callbackListener = (f : ElementCallback<T, boolean>) => {
            result.splice(0, result[O].length, ...this[O].map(f, thisArg[O].value));
        };
        const thisArgListener = (thisArg : any) => {
            result.splice(0, result[O].length, ...this[O].map(callback[O].value, thisArg));
        };
    
        this[C].on("splice", listener);
        callback[C].on("set", callbackListener);
        thisArg[C].on("set", thisArgListener);
    
        result[S] = () => {
            this[C].off("splice", listener);
            callback[C].off("set", callbackListener);
            thisArg[C].on("set", thisArgListener);
        };
    
        return result;
    }
    map<R>(callback : Function<PureElementCallback<T, R>>) {
        const result = new Array(this[O].map(callback[O].value));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            result.splice(start, deleted.length, ...inserted.map(callback[O].value));
        };
        const callbackListener = (f : PureElementCallback<T, boolean>) => {
            result.splice(0, result[O].length, ...this[O].map(f));
        };
    
        this[C].on("splice", listener);
        callback[C].on("set", callbackListener);
    
        result[S] = () => {
            this[C].off("splice", listener);
            callback[C].off("set", callbackListener);
        };
    
        return result;
    }
    reduce(callback : Function<PureReduceCallback<T, T>>) : Primitive<T>
    reduce<R>(callback : Function<PureReduceCallback<T, T>>, initialValue : Primitive<R>) : Primitive<R>
    reduce<R>(callback : Function<PureReduceCallback<T, R>>, initialValue? : Primitive<R>) {
        let reduceds : (R|T)[] = [];
        if(this[O].length) reduceds.push(initialValue ? callback[O].value(initialValue[O].value, this[O][0]) : this[O][0]);
        for(let i = 1; i < this[O].length; i++) {
            reduceds.push(callback[O].value(<R>reduceds[i - 1], this[O][i]));
        }
        const result = new Primitive(this[O].length ? reduceds[reduceds.length - 1] : initialValue[O].value);

        const listener = (start : number, deleted : T[], inserted : T[]) => {
            if(!start) {
                reduceds = [];
                if(this[O].length) reduceds.push(initialValue ? callback[O].value(initialValue[O].value, this[O][0]) : this[O][0]);
                for(let i = 1; i < this[O].length; i++) {
                    reduceds.push(callback[O].value(<R>reduceds[i - 1], this[O][i]));
                }
                result.set(this[O].length ? reduceds[reduceds.length - 1] : initialValue[O].value);
            } else {
                reduceds.splice(start);
                for(let i = start; i < this[O].length; i++) {
                    reduceds.push(callback[O].value(<R>reduceds[i - 1], this[O][i]));
                }
            }
            result.set(this[O].length ? reduceds[reduceds.length - 1] : initialValue[O].value);
        };
        const callbackListener = (callback : PureReduceCallback<T, R>) => {
            reduceds = [];
            if(this[O].length) reduceds.push(initialValue ? callback(initialValue[O].value, this[O][0]) : this[O][0]);
            for(let i = 1; i < this[O].length; i++) {
                reduceds.push(callback(<R>reduceds[i - 1], this[O][i]));
            }
            result.set(this[O].length ? reduceds[reduceds.length - 1] : initialValue[O].value);
        };
        const initialValueListener = (initialValue : R) => {
            reduceds = [];
            if(this[O].length) reduceds.push(initialValue ? callback[O].value(initialValue, this[O][0]) : this[O][0]);
            for(let i = 1; i < this[O].length; i++) {
                reduceds.push(callback[O].value(<R>reduceds[i - 1], this[O][i]));
            }
            result.set(this[O].length ? reduceds[reduceds.length - 1] : initialValue);
        };

        this[C].on("splice", listener);
        callback[C].on("set", callbackListener);
        if(initialValue) {
            initialValue[C].on("set", initialValueListener);
        }

        result[S] = () => {
            this[C].off("splice", listener);
            callback[C].off("set", callbackListener);
            if(initialValue) {
                initialValue[C].off("set", initialValueListener);
            }
        };

        return result;
    }
    slice(begin_ : Number = new Number(0), end_? : Number) {
        const result = new Array(this[O].slice(begin_[O].value, end_[O].value));
        const length = this.length;
        if(!end_) end_ = length;
        const begin = changeableRealIndex(begin_, length);
        const end = changeableRealIndex(end_, length);
        let beforeBegin = begin[O].value;
        let beforeEnd = end[O].value;

        const listener = (start : number, deleted : T[], inserted : T[]) => {
            if(start <= end[O].value) {
                const resultIndex = start - begin[O].value;
                if(resultIndex < 0) {
                    if((resultIndex + deleted.length) > 0) {
                        result.splice(0, resultIndex + deleted.length, ...this[O].slice(begin[O].value, resultIndex + inserted.length));
                    } else {
                        result.splice(0, deleted.length - inserted.length, ...this[O].slice(begin[O].value, begin[O].value + inserted.length - deleted.length));
                    }
                } else {
                    result.splice(resultIndex, deleted.length, ...inserted);
                }
                const rightResultLength = Math.max(0, end[O].value - begin[O].value);
                result.splice(rightResultLength, Infinity, ...this[O].slice(begin[O].value + result[O].length, begin[O].value + rightResultLength)); //cut and fill
            }
        };
        const beginListener = (begin : number) => {
            result.splice(0, begin - beforeBegin, ...this[O].slice(begin, beforeBegin));
            beforeBegin = begin;
        };
        const endListener = (end : number) => {
            if(end > beforeEnd) {
                result.splice(result[O].length, 0, ...this[O].slice(beforeEnd, end));
            } else {
                result.splice(end - beforeEnd, beforeEnd - end);
            }
            beforeEnd = end;
        };

        this[C].on("splice", listener);
        begin[C].on("set", beginListener);
        end[C].on("set", endListener);

        result[S] = () => {
            length[S]();
            begin[S]();
            end[S]();
            this[C].off("splice", listener);
        };

        return result;
    }
    get length() {
        const result = new Number(this[O].length);

        const listener = () => {
            result.set(this[O].length);
        };

        this[C].on("splice", listener);

        result[S] = () => {
            this[C].off("splice", listener);
        }

        return result;
    }

    //Function
    forEach(callback : ElementCallback<T, boolean>, thisArg? : any) {
        return this[O].forEach(callback, thisArg);
    }
}