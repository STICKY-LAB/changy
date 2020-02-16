const { Primitive, Object, Array, Number, O, C, S } = require("../dist/index");

console.log("--- Array test ---");
(() => {
    const array1 = new Array; //길이 0
    const array2 = new Array; //길이 0
    array2[1] = 40;           //array2 길이 2
    const array3 = new Array; //길이 0

    const concatArrays = new Array(array2);
    const concated = array1.concat(concatArrays);
    concated[C].onAny(() => {
        console.log(concated[O]);
    });

    array2.push(80);
    array1[0] = 8;
    array1[2] = 16;
    array3[4] = 80;
    concatArrays.push(array3);
    array3[4] = 4;
    array3[4] = 5;
    concatArrays.splice(0,1);
    concatArrays.splice(0,1);
    array2.push(4444);
    concated[S]();

    array1[2] = 160;
})();
