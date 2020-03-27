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
    const result = new Number(index[O] < 0 ? (index[O] < -length ? 0 : length[O] + index[O]) : (index[O] > length[O] ? length[O] : index[O]));

    const indexListener = (index : number) => {
        result.set(index < 0 ? (index < -length ? 0 : length[O] + index) : (index > length[O] ? length[O] : index));
    };

    const lengthListener = (length : number) => {
        result.set(index[O] < 0 ? (index[O] < -length ? 0 : length + index[O]) : (index[O] > length ? length : index[O]));
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
export type CompareCallback<T, R> = (a : T, b : T) => R

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
    Get(index : Number) {
        const result = new Primitive<T>(this[O][index[O]]);
        const listener = () => {
            result.set(this[O][index[O]]);
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

    length = (() => {
        const result = new Number(this[O].length);

        const listener = () => {
            result.set(this[O].length);
        };

        this[C].on("splice", listener);

        this[S] = () => {
            result[S]();
        };

        return result;
    })()

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
        const beforeLength = this[O].length;
        const result = deleteCount !== undefined ? this[O].splice(start, deleteCount, ...items) : this[O].splice(start);
        if(!(deleteCount === 0 && items.length === 0)) {
            this[C].emit("splice",
                realIndex(start, beforeLength),
                result,
                items
            );
        }
        return result;
    }

    Concat(arrays : Array<Array<any>> = new Array([])) {
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
    ImpureEvery(callback : Function<ElementCallback<T, boolean>>, thisArg : Primitive<any> = new Primitive(undefined)) {
        const result = new Boolean(this[O].every(<any>callback[O], thisArg[O]));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            result.set(this[O].every(callback[O], thisArg[O]));
        };
        const callbackListener = (f : ElementCallback<T, boolean>) => {
            result.set(this[O].every(f, thisArg[O]));
        };
        const thisArgListener = (thisArg : any) => {
            result.set(this[O].every(callback[O], thisArg));
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
    Every(callback : Function<PureElementCallback<T, boolean>>) {
        let callbackResults = this[O].map(callback[O]);
        const result = new Boolean(callbackResults.every(isPassed => isPassed));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            const callbackResults_inserted = inserted.map(callback[O]);
            const callbackResults_deleted = callbackResults.splice(start, deleted.length, ...callbackResults_inserted);
            
            if(result[O]) {
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
    ImpureFilter(callback : Function<ElementCallback<T, boolean>>, thisArg : Primitive<any> = new Primitive(undefined)) {
        const result = new Array(this[O].filter(<any>callback[O], thisArg[O]));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            result.splice(0, result[O].length, ...this[O].filter(callback[O], thisArg[O]));
        };
        const callbackListener = (f : ElementCallback<T, boolean>) => {
            result.splice(0, result[O].length, ...this[O].filter(f, thisArg[O]));
        };
        const thisArgListener = (thisArg : any) => {
            result.splice(0, result[O].length, ...this[O].filter(callback[O], thisArg));
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
    Filter(callback : Function<PureElementCallback<T, boolean>>) {
        let callbackResults = this[O].map(callback[O]);
        const result = new Array(this[O].filter((element, index) => callbackResults[index]));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            const callbackResults_inserted = inserted.map(callback[O]);
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
    ImpureFind(callback : Function<ElementCallback<T, boolean>>, thisArg : Primitive<any> = new Primitive(undefined)) {
        const result = new Primitive(this[O].find(callback[O], thisArg[O]));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            result.set(this[O].find(callback[O], thisArg[O]));
        };
        const callbackListener = (f : ElementCallback<T, boolean>) => {
            result.set(this[O].find(f, thisArg[O]));
        };
        const thisArgListener = (thisArg : any) => {
            result.set(this[O].find(callback[O], thisArg));
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
    Find(callback : Function<PureElementCallback<T, boolean>>) {
        const index = this.FindIndex(callback);
        const result = this.Get(index);
    
        result[S] = () => {
            index[S]();
            result[S]();
        };
    
        return result;
    }
    ImpureFindIndex(callback : Function<ElementCallback<T, boolean>>, thisArg : Primitive<any> = new Primitive(undefined)) {
        const result = new Number(this[O].findIndex(callback[O], thisArg[O]));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            result.set(this[O].findIndex(callback[O], thisArg[O]));
        };
        const callbackListener = (f : ElementCallback<T, boolean>) => {
            result.set(this[O].findIndex(f, thisArg[O]));
        };
        const thisArgListener = (thisArg : any) => {
            result.set(this[O].findIndex(callback[O], thisArg));
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
    FindIndex(callback : Function<PureElementCallback<T, boolean>>) {
        let callbackResults = this[O].map(callback[O]);
        const result = new Number(this[O].findIndex((element, index) => callbackResults[index]));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            const callbackResults_inserted = inserted.map(callback[O]);
            const callbackResults_deleted = callbackResults.splice(start, deleted.length, ...callbackResults_inserted);
            if(this[O].length) {
                if(result[O] === -1) {
                    const index = callbackResults_inserted.findIndex(isPassed => isPassed);
                    if(index !== -1) {
                        result.set(start + index);
                    }
                } else {
                    if(result[O] >= start) {
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
    //     if(depth[O] >= 1) {

    //     }
    // }
    // flatMap() { //NOT COMPLETE

    // }
    Includes(valueToFind : Primitive<T>, fromIndex_ : Number = new Number(0)) {
        const result = new Boolean(this[O].includes(valueToFind[O], fromIndex_[O]));
        const length = this.length;
        const fromIndex = changeableRealIndex(fromIndex_, length);
        let beforeFromIndex = fromIndex[O];

        const listener = (start : number, deleted : T[], inserted : T[]) => {
            if(!result[O]) {
                result.set(inserted.includes(valueToFind[O], fromIndex[O]));
            } else {
                if(deleted.includes(valueToFind[O])) {
                    if(!inserted.includes(valueToFind[O])) {
                        result.set(this[O].includes(valueToFind[O], fromIndex[O]));
                    }
                }
            }
        };
        const valueToFindListener = (valueToFind : T) => {
            result.set(this[O].includes(valueToFind, fromIndex[O]));
        };
        const fromIndexListener = (fromIndex : number) => {
            if(!result[O]) {
                if(fromIndex < beforeFromIndex) {
                    result.set(this[O].includes(valueToFind[O], fromIndex));
                }
            } else {
                if(fromIndex > beforeFromIndex) {
                    result.set(this[O].includes(valueToFind[O], fromIndex));
                }
            }
            beforeFromIndex = fromIndex;
        };

        this[C].on("splice", listener);
        valueToFind[C].on("set", valueToFindListener);
        fromIndex[C].on("set", fromIndexListener);

        result[S] = () => {
            fromIndex[S]();
            this[C].off("splice", listener);
            valueToFind[C].off("set", valueToFindListener);
            fromIndex[C].off("set", fromIndexListener);
        };
        return result;
    }
    IndexOf(searchElement : Primitive<T>, fromIndex_ : Number = new Number(0)) {
        const result = new Number(this[O].indexOf(searchElement[O], fromIndex_[O]));
        const length = this.length;
        const fromIndex = changeableRealIndex(fromIndex_, length);
        let beforeFromIndex = fromIndex[O];

        const listener = (start : number, deleted : T[], inserted : T[]) => {
            if(result[O] === -1) {
                result.set(inserted.indexOf(searchElement[O], fromIndex[O]));
            } else {
                if(deleted.includes(searchElement[O])) {
                    if(!inserted.includes(searchElement[O])) {
                        result.set(this[O].indexOf(searchElement[O], fromIndex[O]));
                    }
                }
            }
        };
        const searchElementListener = (searchElement : T) => {
            result.set(this[O].indexOf(searchElement, fromIndex[O]));
        };
        const fromIndexListener = (fromIndex : number) => {
            if(result[O] === -1) {
                if(fromIndex < beforeFromIndex) {
                    result.set(this[O].indexOf(searchElement[O], fromIndex));
                }
            } else {
                if(fromIndex > beforeFromIndex) {
                    result.set(this[O].indexOf(searchElement[O], fromIndex));
                }
            }
            beforeFromIndex = fromIndex;
        };

        this[C].on("splice", listener);
        searchElement[C].on("set", searchElementListener);
        fromIndex[C].on("set", fromIndexListener);

        result[S] = () => {
            fromIndex[S]();
            this[C].off("splice", listener);
            searchElement[C].off("set", searchElementListener);
            fromIndex[C].off("set", fromIndexListener);
        };
        return result;
    }
    Join(separator : String<any> = new String("")) { //efficiency not good. I think we need "ArrayString" class.
        const result = new String(this[O].join(separator[O]));

        const listener = () => {
            result.set(this[O].join(separator[O]));
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
    ImpureMap<R>(callback : Function<ElementCallback<T, R>>, thisArg : Primitive<any> = new Primitive(undefined)) {
        const result = new Array(this[O].map(<any>callback[O], thisArg[O]));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            result.splice(0, result[O].length, ...this[O].map(callback[O], thisArg[O]));
        };
        const callbackListener = (f : ElementCallback<T, boolean>) => {
            result.splice(0, result[O].length, ...this[O].map(f, thisArg[O]));
        };
        const thisArgListener = (thisArg : any) => {
            result.splice(0, result[O].length, ...this[O].map(callback[O], thisArg));
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
    Map<R>(callback : Function<PureElementCallback<T, R>>) {
        const result = new Array(this[O].map(callback[O]));
    
        const listener = (start : number, deleted : T[], inserted : T[]) => {
            result.splice(start, deleted.length, ...inserted.map(callback[O]));
        };
        const callbackListener = (f : PureElementCallback<T, R>) => {
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
    Push(items : Array<Primitive<T>>) {
        const originalItems = new Array(items[O].map(item => item[O]));
        const result : Array<T> = this.Concat(new Array([originalItems]));

        return result;
    }
    Reduce(callback : Function<PureReduceCallback<T, T>>) : Primitive<T>
    Reduce<R>(callback : Function<PureReduceCallback<T, T>>, initialValue : Primitive<R>) : Primitive<R>
    Reduce<R>(callback : Function<PureReduceCallback<T, R>>, initialValue? : Primitive<R>) {
        let reduceds : (R|T)[] = [];
        if(this[O].length) reduceds.push(initialValue ? callback[O](initialValue[O], this[O][0]) : this[O][0]);
        for(let i = 1; i < this[O].length; i++) {
            reduceds.push(callback[O](<R>reduceds[i - 1], this[O][i]));
        }
        const result = new Primitive(this[O].length ? reduceds[reduceds.length - 1] : initialValue[O]);

        const listener = (start : number, deleted : T[], inserted : T[]) => {
            if(!start) {
                reduceds = [];
                if(this[O].length) reduceds.push(initialValue ? callback[O](initialValue[O], this[O][0]) : this[O][0]);
                for(let i = 1; i < this[O].length; i++) {
                    reduceds.push(callback[O](<R>reduceds[i - 1], this[O][i]));
                }
                result.set(this[O].length ? reduceds[reduceds.length - 1] : initialValue[O]);
            } else {
                reduceds.splice(start);
                for(let i = start; i < this[O].length; i++) {
                    reduceds.push(callback[O](<R>reduceds[i - 1], this[O][i]));
                }
            }
            result.set(this[O].length ? reduceds[reduceds.length - 1] : initialValue[O]);
        };
        const callbackListener = (callback : PureReduceCallback<T, R>) => {
            reduceds = [];
            if(this[O].length) reduceds.push(initialValue ? callback(initialValue[O], this[O][0]) : this[O][0]);
            for(let i = 1; i < this[O].length; i++) {
                reduceds.push(callback(<R>reduceds[i - 1], this[O][i]));
            }
            result.set(this[O].length ? reduceds[reduceds.length - 1] : initialValue[O]);
        };
        const initialValueListener = (initialValue : R) => {
            reduceds = [];
            if(this[O].length) reduceds.push(initialValue ? callback[O](initialValue, this[O][0]) : this[O][0]);
            for(let i = 1; i < this[O].length; i++) {
                reduceds.push(callback[O](<R>reduceds[i - 1], this[O][i]));
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
    Slice(begin_ : Number = new Number(0), end_? : Number) {
        const result = new Array(this[O].slice(begin_[O], end_[O]));
        const length = this.length;
        if(!end_) end_ = length;
        const begin = changeableRealIndex(begin_, length);
        const end = changeableRealIndex(end_, length);
        let beforeBegin = begin[O];
        let beforeEnd = end[O];

        const listener = (start : number, deleted : T[], inserted : T[]) => {
            if(start <= end[O]) {
                const resultIndex = start - begin[O];
                if(resultIndex < 0) {
                    if((resultIndex + deleted.length) > 0) {
                        result.splice(0, resultIndex + deleted.length, ...this[O].slice(begin[O], resultIndex + inserted.length));
                    } else {
                        result.splice(0, deleted.length - inserted.length, ...this[O].slice(begin[O], begin[O] + inserted.length - deleted.length));
                    }
                } else {
                    result.splice(resultIndex, deleted.length, ...inserted);
                }
                const rightResultLength = Math.max(0, end[O] - begin[O]);
                result.splice(rightResultLength, Infinity, ...this[O].slice(begin[O] + result[O].length, begin[O] + rightResultLength)); //cut and fill
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
            begin[S]();
            end[S]();
            this[C].off("splice", listener);
        };

        return result;
    }
    Sort(compareFunction : Function<CompareCallback<T, number>> = new Function((a, b) => (a > b) ? 1 : -1)) {
        const result = new Array(OriginalArray.from(this[O]).sort(compareFunction[O]));

        const listener = (start : number, deleted : T[], inserted : T[]) => {
            deleted.forEach(deletedElement => {
                result.splice(result[O].indexOf(deletedElement), 1);
            });
            inserted.forEach(insertedElement => {
                const index = result[O].findIndex(element => {
                    return compareFunction[O](element, insertedElement) > 0;
                });
                if(index === -1) {
                    result.push(insertedElement);
                } else {
                    result.splice(index, 0, insertedElement);
                }
            });
        };
        const compareFunctionListener = (compareFunction : CompareCallback<T, number>) => {
            result.splice(0, result[O].length, ...this[O].sort(compareFunction));
        };

        this[C].on("splice", listener);
        compareFunction[C].on("set", compareFunctionListener);

        result[S] = () => {
            this[C].off("splice", listener);
            compareFunction[C].off("set", compareFunctionListener);
        };

        return result;
    }
    
    static FromChangeable<T>(array : Array<Changeable<T>>) {
        const result = new Array(array[O].map(item => item[O]));

        const itemListenerRemovers : (() => void)[] = [];
        const addItemListener = (index : number, item : Changeable<T>) => {
            const listener = () => {
                const itemIndex = array[O].indexOf(item);
                if(item[O] !== result[O][itemIndex]) {
                    result.splice(itemIndex, 1, item[O]);
                }
            };
            item[C].onAny(listener);
            itemListenerRemovers.splice(index, 0, () => {
                item[C].offAny(listener);
                itemListenerRemovers.splice(array[O].indexOf(item), 1);
            });
        };
        array[O].forEach((item, index) => {
            addItemListener(index, item);
        });

        const arrayListener = (start : number, deleted : Changeable<T>[], inserted : Changeable<T>[]) => {
            itemListenerRemovers.splice(start, deleted.length).forEach(remove => remove());
            inserted.forEach((insertedItem, index) => {
                addItemListener(start + index, insertedItem);
            });
            result.splice(start, deleted.length, ...inserted.map(item => item[O]));
        };
        array[C].on("splice", arrayListener);

        result[S] = () => {
            itemListenerRemovers.splice(0).forEach(remove => remove());
            array[C].off("splice", arrayListener);
        };

        return result;
    }
}