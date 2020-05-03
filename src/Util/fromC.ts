import Changeable, { O, C, S } from "../Changeable/Changeable";
import Primitive from "../BuiltIn/Primitive/Primitive";

function fromC<V, T extends Primitive<V>>(changeable : Changeable<T>, primitiveClass? : (new (value : V) => T)) : T {
    const result = new (primitiveClass ? primitiveClass : (<{new(value : V) : T}>changeable[O].constructor))(changeable[O][O]);

    // outer Listener
    const listener = () => {
        lastInner[C].off("set", innerListener);
        lastInner = changeable[O];
        lastInner[C].on("set", innerListener);
    };
    changeable[C].onAny(listener);

    // inner Listener
    const innerListener = () => {
        result.set(changeable[O][O]);
    };
    let lastInner = changeable[O];
    lastInner[C].on("set", innerListener);

    result[S] = (() => {
        changeable[C].offAny(listener);
        lastInner[C].off("set", innerListener);
    });

    return result;
}

export default fromC;