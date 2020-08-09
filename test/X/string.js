const { String, cF, C, S, O, Number, Function, RegExp, Object, cast, fromC, Primitive } = require("../../dist/index");

{
    const href = new String("/posts/5");
    const strs = href.Split(new String("/"));
    const dirs = strs.Filter(new Function(v => v !== ""));

    dirs[C].on("splice", function() {
        console.log(dirs[O]);
    });

    const postNumber = Number.ParseInt(cast(dirs.Get(new Number(1)), String));
    postNumber[C].on("set", postNumber => {
        console.log(`post number : ${postNumber}`)
    });
    href.set("/posts/10/");
    href.set("/posts/1");
}