import EventEmitter from "wolfy87-eventemitter";
import Changeable, { C } from "./Changeable";

type EventListeners = { [event : string]: Function };

class ChangeEventEmitter extends EventEmitter {
    private inputs : ChangeEventEmitter[] = [];
    private inputsListeners : EventListeners[] = [];
    private outputs : ChangeEventEmitter[] = [];

    in : boolean = false;
    out : boolean = false;

    private getEventNamesFromEvent(event : string | RegExp) {
        return (
            typeof event === "string"
            ?
                [event]
            :
                Object.keys(this.getListenersAsObject(event))
        );
    }
    private getOutputByListener(listener : Function) {
        return this.outputs.find(output => {
            return output.inputs.includes(this) && Object.values(output.inputsListeners[output.inputs.indexOf(this)]).includes(listener);
        });
    }
    connectInput(input : ChangeEventEmitter, inputListeners : EventListeners) {
        // input
        if(!this.inputs.includes(input)) {
            this.inputs.push(input);
            this.inputsListeners.push({});
            input.outputs.push(this);
        }
        Object.assign(this.inputsListeners[this.inputs.indexOf(input)], inputListeners);
    }
    disconnectInput(input : ChangeEventEmitter) {
        if(this.inputs.includes(input)) {
            const index = this.inputs.indexOf(input);
            this.inputs.splice(index, 1);
            const inputListeners = this.inputsListeners.splice(index, 1)[0];
            input.removeListeners(inputListeners);
            
            input.outputs.splice(input.outputs.indexOf(this), 1);

            if(!input.stopped && !input.hasOut && !input.in) input.stop();
            if(!this.stopped && !this.inputs.length && !this.out) this.stop();
        }
    }
    disconnectOutput(output : ChangeEventEmitter) {
        output.disconnectInput(this);
    }
    addListener(event : string | RegExp, listener : Function, output? : Changeable<any>): EventEmitter {
        if(output) {
            const events = this.getEventNamesFromEvent(event);
            output[C].connectInput(this, Object.fromEntries(events.map(event => [event, listener])));
        }
        super.addListener(<any>event, listener);
        return this;
    }
    on(event : string | RegExp, listener : Function, output? : Changeable<any>): EventEmitter {
        return this.addListener(event, listener, output);
    };
    removeListener(event : string | RegExp, listener : Function): EventEmitter {
        const output = this.getOutputByListener(listener);
        if(output) {
            if(output.inputs.includes(this)) { //만약 disconnectInput을 통해서 removeListener가 호출됐다면 이미 inputs에 this가 존재하지 않음.
                const output_thisListeners = output.inputsListeners[output.inputs.indexOf(this)];
                const events = this.getEventNamesFromEvent(event);
                for(const event of events)
                    if(output_thisListeners[event] === listener)
                        delete output_thisListeners[event];
                if(!Object.keys(output_thisListeners).length) output.disconnectInput(this);
            }
        }
        return super.removeListener(<any>event, listener);
    }
    off(event : string | RegExp, listener : Function): EventEmitter {
        return this.removeListener(event, listener);
    }
    addListeners(event: EventListeners | string | RegExp, outputOrListeners? : Changeable<any> | Function[]): EventEmitter {
        if(outputOrListeners instanceof Changeable) { //and event should be EventListeners
            for(const eventName in (<EventListeners>event)) {
                this.addListener(eventName, (<EventListeners>event)[eventName], outputOrListeners);
            }
            return this;
        }
        return super.addListeners(<any>event, outputOrListeners);
    }
    removeListeners(event: EventListeners | string | RegExp, listeners?: Function[]): EventEmitter {
        if(!listeners) {
            for(const eventName in (<EventListeners>event)) {
                this.removeListener(eventName, (<EventListeners>event)[eventName]);
            }
            return this;
        }
        return super.removeListeners(<any>event);
    }
    stop() {
        for(const output of Array.from(this.outputs))
            this.disconnectOutput(output);
        for(const input of Array.from(this.inputs))
            this.disconnectInput(input);
    }
    get stopped() {
        return !(this.inputs.length || this.outputs.length);
    }
    get hasOut() : boolean {
        return this.out || this.outputs.some(output => output.hasOut);
    }
};

export default ChangeEventEmitter;