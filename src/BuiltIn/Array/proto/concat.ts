import Array from "../Array";
import { O, C, S } from "../../../Changeable";
import OriginalArray from "../OriginalArray";

export default function concat<T>(this : Array<T>, arrays : Array<Array<any>> = new Array()) {

    const result = new Array;
    result.push(...this[O], ...OriginalArray.prototype.concat(...arrays[O].map(array => array[O])));

    const arrayListenerRemovers : (() => void)[] = [];
    const listenArray = (array : Array<any>) => {
        const listener = ((start : number, deleted : any[], items : any[]) => {
            const leftIndex = this[O].length + arrays[O].slice(0, arrays[O].indexOf(array)).reduce((sum, array) => (sum + array[O].length), 0);
            result.splice(leftIndex + start, deleted.length, ...items);
        });
        array[C].on("insert", listener);
        return () => {
            array[C].off("insert", listener);
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
    this[C].on("insert", thisListener);
    arrays[C].on("insert", arraysListener);

    result[S] = (() => {
        this[C].off("insert", thisListener);
        arrays[C].off("insert", arraysListener);
        arrayListenerRemovers.forEach(remove => remove());
    });
    return result;
}