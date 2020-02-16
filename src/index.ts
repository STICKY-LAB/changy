import Changeable, { O, C, S } from "./Changeable";
import ChangeEventEmitter from "./ChangeEventEmitter";
import Primitive from "./BuiltIn/Primitive/Primitive";
import ChangeableClass from "./ChangeableClass/ChangeableClass";
import Object from "./BuiltIn/Object/Object";
import Array from "./BuiltIn/Array/Array";
import Number from "./BuiltIn/Number/Number";
import Function from "./BuiltIn/Function/Function";
import Boolean from "./BuiltIn/Boolean/Boolean";

export {
    Changeable,
    ChangeEventEmitter,
    O,
    C,
    S,

    ChangeableClass,

    //Built-ins.
    Primitive, //완성
    Object,
    Array,
    Number,    //완성
    Function,
    Boolean    //완성
};

var a = new Number(45);
a

//QOVSC