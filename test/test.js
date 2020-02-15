const { Primitive, Object, Array, Number, O, C, S } = require("../dist/index");

console.log("--- Primitive test ---");
(() => {
    const a = new Primitive(40);
    a.set(2134);
    
    a[C].on("set", value => {
        console.log(value);
    });
    
    a.set(400);
})();


console.log("--- Object test ---");
(() => {
    const obj = new Object();
    const hasOwnProperty = Object.proto.hasOwnProperty.call(obj, new Primitive("jam"));
    hasOwnProperty[C].on("set", value => {
        console.log(`hasOwnProperty("jam") : ${value}`);
    });

    obj.ha = 3;
    console.log(obj[O]);

    obj.jam = 3;
    obj.jam = "siba";
    delete obj.jam;

    hasOwnProperty[S]();

    const objJam = obj.jam;
    objJam[C].on("set", value => {
        console.log(`obj.jam : ${value}`);
    });

    obj.jam = 43;
    delete obj.jam;

    console.log(obj[O]);
    Object.assign(obj, {jam:40, a:40}, {jam:0});
    console.log(obj[O]);
})();

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

