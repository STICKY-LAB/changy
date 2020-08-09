const { Array, Function, cF, C, S } = require("../../dist/index");

const arr = new Array([1,2,3]);
console.log(arr[C]);

const mapped = arr.Map(new Function(v => v*2));
console.log("--------------------------");
console.log(arr[C], mapped[C]);

const mapmapped = mapped.Map(new Function(v => v**2));
console.log("--------------------------");
console.log(arr[C], mapped[C], mapmapped[C]);

mapmapped[S]();
console.log("--------------------------");
console.log(arr[C], mapped[C], mapmapped[C]);