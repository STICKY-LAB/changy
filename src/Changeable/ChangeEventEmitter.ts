import EventEmitter from "wolfy87-eventemitter";

type AnyCallback = (eventName : string, ...args:any) => void;

class ChangeEventEmitter extends EventEmitter {
    anyListeners: AnyCallback[];
    constructor() {
        super();
        this.anyListeners = []; //triger랑 emit이랑 emitEvent 래핑하기
    }
    onAny(listener : AnyCallback) {
        this.anyListeners.push(listener);
    }
    offAny(listener : AnyCallback) {
        this.anyListeners.splice(this.anyListeners.indexOf(listener), 1);
    }
    emitEvent(evt : string | RegExp, args? : any[]) {
        this.anyListeners.forEach(anyListener => {
            anyListener.call(undefined, evt, ...args);
        });
        super.emitEvent(<any>evt, args);
        return this;
    }
};

export default ChangeEventEmitter;