const { Number, Array, Function, Primitive, O, C, S } = require("../dist/index");

//NOT SUPPORT YET>

console.log("--- Function test ---");
(() => {

    // call
    console.log("- call -")
    {
        const f = new Function(function (...args) {
            return this + args.reduce((sum, arg) => (sum + arg.value), 0);
        });

        const a = new Number(1);
        const b = new Number(3);
        const c = new Number(6);

        const args = new Array(b, c);
        const sum = f.call(a, args);

        sum[C].on("set", value => {
            console.log(`sum : ${value}`);
        });

        a.set(2);
        args.push(new Number(7));
        b.set(-9);

        sum[S]();
    }

    // apply
    console.log("- apply -");
    {
        const f = new Function(function (...args) {
            return this + args.reduce((sum, arg) => (sum + arg), 0);
        });

        const a = new Number(1);
        const b = 3;
        const c = 6;

        const args = new Array(b, c);
        const sum = f.apply(a, args);

        sum[C].on("set", value => {
            console.log(`sum : ${value}`);
        });

        a.set(2);
        args.push(7);
        args[0] = -9;

        sum[S]();
    }

    //bind
    console.log("- bind -");
    {
        const f = new Function(function (...args) {
            return this + args.reduce((sum, arg) => (sum + arg.value), 0);
        });

        const a = new Number(0);
        const b = new Number(2);
        const c = new Number(3);

        const bindArgs = new Array();
        const bindedF = f.bind(a, bindArgs);

        const args = new Array();
        const sum = bindedF.call(new Primitive(null), args);

        sum[C].on("set", value => {
            console.log(`sum : ${value}`);
        });

        a.set(1);
        bindArgs.push(b);
        bindArgs.push(c);
        args.push(new Primitive(40));
    }

    //toString
    console.log("- toString -");
    {
        const f = new Function(function sum(...args) {
            return args.reduce((sum, arg) => (sum + arg), 0);
        });

        const fToString = f.toString();
        fToString[C].on("set", value => {
            console.log(`f to string : ${value}`);
        });

        f.set(function product(...args) { return args.reduce((sum, arg) => (sum * arg), 1); });
    }

    //length, name
    console.log("- length, name -");
    {
        const f = new Function(function sum(...args) {
            return args.reduce((sum, arg) => (sum + arg), 0);
        });

        const length = f.length;
        const name = f.name;
        length[C].on("set", value => {
            console.log(`f.length : ${value}`);
        });
        name[C].on("set", value => {
            console.log(`f.name : ${value}`);
        });

        f.set(function sum(a, b) {
            return a + b;
        });
        f.set(function product(a, b) {
            return a * b;
        });
    }
})();

