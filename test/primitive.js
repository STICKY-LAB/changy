const { Primitive, Object, Number, O, C, S } = require("../dist/index");

console.log("--- Primitive test ---");
(() => {
    const a = new Primitive(40);
    a.set(2134);
    
    a[C].on("set", value => {
        console.log(value);
    });
    
    a.set(400);
    a.set(400);
})();