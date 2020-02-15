import Changeable, { O, C, S } from "./Changeable";
import ChangeEventEmitter from "./ChangeEventEmitter";
import Primitive from "./BuiltIn/Primitive/Primitive";
import ChangeableClass from "./ChangeableClass/ChangeableClass";
import Object from "./BuiltIn/Object/Object";
import Array from "./BuiltIn/Array/Array";
import Number from "./BuiltIn/Number/Number";
//import ChangeableFunction, { StopableChangeableInstance } from "./ChangeableFunction";

export {
    Changeable,
    ChangeEventEmitter,
    O,
    C,
    S,

    ChangeableClass,

    //Built-ins.
    Primitive,
    Object,
    Array,
    Number
};

var a = new Number(45);
a

//QOVSC