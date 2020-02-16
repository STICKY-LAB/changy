const { Primitive, Object, Array, Number, O, C, S } = require("../dist/index");

console.log("--- Object test ---");
(() => {
    const obj = new Object();
    const hasOwnProperty = Object.proto.hasOwnProperty.call(obj, new Primitive("jam"));
    hasOwnProperty[C].on("set", value => {
        console.log(`hasOwnProperty("jam") : ${value}`);
    });

    console.log("- hasOwnProperty -")
    obj.ha = 3;
    obj.jam = 3;
    obj.jam = "siba";
    delete obj.jam;

    hasOwnProperty[S]();

    console.log("- value set, assign -")
    const objJam = obj.jam;
    objJam[C].on("set", value => {
        console.log(`obj.jam : ${value}`);
    });

    obj.jam = 43;
    delete obj.jam;

    console.log(obj[O]);
    Object.assign(obj, {jam:40, a:40}, {jam:0});
    console.log(obj[O]);

    objJam[S]();

    const keys = Object.keys(obj);
    keys[C].onAny(() => {
        console.log(keys[O]);
    });

    obj[8] = 4;
    obj[2**32 - 2] = 8;
    obj[1] = 9;
    obj[2**32 - 1] = 8;
    delete obj[1];
})();