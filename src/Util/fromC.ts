import Changeable, { O, C, S } from "../Changeable/Changeable";
import Primitive from "../BuiltIn/Primitive/Primitive";

function fromC<V, T extends Primitive<V>>(changeable : Changeable<T>, primitiveClass? : (new (value : V) => T)) : T {
    const result = new (primitiveClass ? primitiveClass : (<{new(value : V) : T}>changeable[O].constructor))(undefined);

    // outer Listener
    const listener = () => {
        lastInner[C].off("set", innerListener);
        lastInner = changeable[O];
        result.set(lastInner[O]);
        lastInner[C].on("set", innerListener, result);
    };
    changeable[C].on(/^/, listener, result);

    // inner Listener
    const innerListener = () => {
        result.set(lastInner[O]);
    };
    let lastInner = changeable[O];
    result.set(lastInner[O]);
    lastInner[C].on("set", innerListener, result);

    return result;
}

export default fromC;