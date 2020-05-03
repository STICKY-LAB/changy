import Primitive from "./Primitive";
import Array from "../Object/Array";
import Number from "../Primitive/Number";
import OriginalString from "../Originals/String";
import { S, O } from "../../Changeable/Changeable";


export default class String<T extends string> extends Primitive<T> {


    /*static fromCharCode(nums : Array<Number>) {
        const result = new String(OriginalString.fromCharCode(...nums[O].map(number => number[O])));

        return result;
    }*/
};