const { Array, Function, cF, C, S } = require("../../dist/index");

const arr1 = new Array([1,2,3]);
const arr2 = new Array([4,5,6]);
const concated = arr1.Concat(new Array([arr2]));
console.log(arr1[C], arr2[C], concated[C]);

concated[S]();
console.log("---------------------");
console.log(arr1[C], arr2[C], concated[C]);