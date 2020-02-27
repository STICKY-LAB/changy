import Primitive from "./Primitive";
import { O, C, S } from "../../Changeable/Changeable";
import String from "./String";

export default class Boolean extends Primitive<boolean> {
    toString() {
        const result = new String(this[O].value.toString());
    
        const listener = (value : boolean) => {
            result.set(value.toString());
        };
    
        this[C].on("set", listener);
    
        result[S] = () => {
            this[C].off("set", listener);
        };
    
        return result;
    }
    valueOf(this : Boolean) {
        const result = new Boolean(this[O].value);
    
        const listener = (value : boolean) => {
            result.set(value);
        };
    
        this[C].on("set", listener);
    
        result[S] = () => {
            this[C].off("set", listener);
        };
    
        return result;
    }
};