

const { Primitive, fromC, C, S } = require("../../dist/index");

const a = new Primitive(null);
const b = new Primitive(8)
const c = new Primitive(50);
a.set(b);

const result = fromC(a);

console.log("--- b ---");
console.log(a[C]);
console.log(b[C]);
console.log(c[C]);
console.log(result[C]);
a[S]();
b[S]();
console.log("--- c ---");
console.log(a[C]);
console.log(b[C]);
console.log(c[C]);
console.log(result[C]);