

const { Array, Primitive, cF, C, S } = require("../../dist/index");

const a = new Primitive(1);
const b = new Primitive(22);
const doubleChangeableArray = new Array([a]);
const array = Array.FromChangeable(doubleChangeableArray);

console.log("--- 1 ---");
console.log(a[C]);
console.log(b[C]);
console.log(doubleChangeableArray[C]);
console.log(array[C]);

doubleChangeableArray.splice(0, 1);
console.log("--- 2 ---");
console.log(a[C]);
console.log(b[C]);
console.log(doubleChangeableArray[C]);
console.log(array[C]);

doubleChangeableArray[S]();
console.log("--- 3 ---");
console.log(a[C]);
console.log(b[C]);
console.log(doubleChangeableArray[C]);
console.log(array[C]);