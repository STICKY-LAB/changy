const { O, C, Number, cF } = require("../dist");


console.log("--- cF - nullish pass test ---");
(() => {
    const plus = cF((a, b) => a + b, Number, true);
    const multiply = cF((a, b) => a * b, Number, true);

    const a = new Number(undefined);
    const b = new Number(4);
    const result = multiply(b, plus(a, new Number(3)));
    result[C].on("set", v => console.log(v));

    console.log(result[O]);
    a.set(3);
    b.set(null);
})();