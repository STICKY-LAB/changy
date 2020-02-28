const { Primitive, Object, Array, Number, O, C, S } = require("../dist/index");

console.log("--- Array test ---");
(() => {
    const array1 = new Array([]);
    const array2 = new Array([]);
    const array3 = new Array([]);

    const concatArrays = new Array([array2]);
    const concated = array1.concat(concatArrays);
    concated[C].onAny(() => {
        console.log(concated[O]);
    });

    array1.push(80);
    array2.push(4444);
    array1.set(2, 40);
    array2.push(70);
    array3.push(55555);
    concatArrays.push(array3);
    concatArrays.splice(0,1);
    concatArrays.splice(0,1);
    concated[S]();
})();
