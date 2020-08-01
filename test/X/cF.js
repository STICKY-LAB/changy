

const { Primitive, cF, C, S } = require("../../dist/index");

const a = new Primitive(5);
const b = cF(v => v**2)(a);
const c = cF(v => v + 1)(b);

console.log("--- before ---");
console.log(a[C]);
console.log(b[C]);
console.log(c[C]);
b[C].in = true;
b[S]();
console.log("--- after ---");
console.log(a[C]);
console.log(b[C]);
console.log(c[C]);