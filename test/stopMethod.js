const { Changeable, O, C, S } = require("../dist/index");

class A extends Changeable { //Don't use Changeable class like this! It's just for test.
    constructor() {
        super(arguments);
        this[S] = (() => {
            console.log("stop A");
        });
    }
}
class B extends A {
    constructor() {
        super(arguments);
        this[S] = (() => {
            console.log("stop B");
        });
    }
}

console.log("--- Stop method test ---");
(() => {
    const b = new B(undefined);
    b[S] = (() => {
        console.log("stop custom");
    });

    b[S]();
})();