const { Primitive, Object, Array, Number, O, C, S } = require("../dist/index");

console.log("--- Number test ---");
(() => {
    const num = new Number(4);
    const numChangeListener = value => {
        console.log(value);
    };
    num[C].on("set", numChangeListener);

    const exponential = num.toExponential();
    exponential[C].on("set", value => {
        console.log(`changed exponential : ${value}`);
    });

    const digit = new Number(0);
    const fixed = num.toFixed(digit);
    fixed[C].on("set", value => {
        console.log(`changed fixed : ${value}`);
    });

    num.set(2.44);
    digit.set(1);
    num.set(2.41);

    //Stop change.
    exponential[S]();
    fixed[S]();
    num[C].off("set", numChangeListener);
    console.log("exponential, fixed, num change listners stopped.");

    const radix = new Number(10);
    const string = num.toString(radix);
    string[C].on("set", value => {
        console.log(`string fixed : ${value}`)
    });

    num.set(10);
    radix.set(2);
    num.set(11);
})();

