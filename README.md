Changy
--------
# Changy
Changy makes built-in objects and other objects reactive.
Changy supports built-in objects : Array, Object, Boolean, Function, Number, String, Primitive,
you can make your own reactive class / function.

# Examples
## Array
```js
const { Array, Number, Function, O, C } = require("changy");

console.log("--- Array test ---");
(() => {

    // concat, push / set, splice
    console.log("- concat, push / set, splice -");
    {
        const array1 = new Array([]);
        const array2 = new Array([]);
        const array3 = new Array([]);

        const concatArrays = new Array([array2]);
        const concated = array1.Concat(concatArrays);
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
        
    }

    // fill
    console.log("- fill -");
    {
        const array = new Array([1,20,22]);
        array[C].on("splice", (start, deleted, inserted) => {
            console.log("splice!!", start, deleted, inserted);
            console.log("array : ", array[O]);
        });
        array.fill(1);
        array.fill(3, -7, 1);
    }

    // every
    console.log("- every -");
    {
        const array = new Array([6,7,9,4,7,6,8]);
        const everyResult = array.Every(new Function(value => {
            console.log("CHECK " + value);
            return value > 5;
        }));
        everyResult[C].on("set", (result) => {
            console.log("Every result changed : " + result);
        });
        array.push(6);
        array.set(3, 10);
        array.set(4, 0);
    }

    // filter
    console.log("- filter -");
    {
        const array = new Array([1,7,9,4,7,3,8]);
        const filtered = array.Filter(new Function(value => {
            console.log("CHECK " + value);
            return value > 5;
        }));
        filtered[C].on("splice", (start, deleted, inserted) => {
            console.log("splice!!   ", start, deleted, inserted);
            console.log("Filtered : ", filtered[O]);
        });
        array.push(6);
        array.set(0, 55);
        array.set(1, 0);
        array.splice(6,2,10,10);

        console.log(array[O]);
    }

    // findIndex (find)
    console.log("- findIndex (find) -");
    {
        const array = new Array([1,7,9,4,7,3,8]);
        const found = array.FindIndex(new Function(value => {
            console.log("CHECK " + value);
            return value > 5;
        }));
        const foundElement = array.Find(new Function(value => {
            return value > 5;
        }));
        found[C].on("set", (index) => {
            console.log("FOUND INDEX   : ", index);
        });
        foundElement[C].on("set", (element) => {
            console.log("FOUND ELEMENT : ", element);
        });
        array.set(0, 9);
        array.set(0, 1);
        array.splice(2, 100);
        array.set(1, 2);
        array.push(9);
    }

    // slice
    console.log("- slice -");
    {
        const array = new Array([1,7,9,4,7,3,8]);
        const begin = new Number(1);
        const end = new Number(5);
        const sliced = array.Slice(begin, end);
        sliced[C].on("splice", (start, deleted, inserted) => {
            console.log("splice!! ", start, deleted, inserted);
            console.log("Sliced : ", sliced[O]);
        });
        end.set(6);
        array.splice(0, 0, 4); //It makes two splice events, because Array in Changy is splice-based array.
        begin.set(4);

        console.log("ARRAY : ", array[O]);
        array.splice(2,2);
    }

    // includes
    console.log("- includes -");
    {
        const array = new Array([1,3,9,4,7,3,8]);
        const valueToFind = new Number(3);
        const fromIndex = new Number(3);
        const includes = array.Includes(valueToFind, fromIndex);
        includes[C].on("set", (value) => {
            console.log("Includes : ", value);
        });
        array.set(5, 4);
        fromIndex.set(0);
        valueToFind.set(7);
        fromIndex.set(5);
        fromIndex.set(4);
    }
    
    // indexOf
    console.log("- indexOf -");
    {
        const array = new Array([1,3,9,4,7,3,8]);
        const valueToFind = new Number(3);
        const fromIndex = new Number(3);
        const includes = array.IndexOf(valueToFind, fromIndex);
        includes[C].on("set", (value) => {
            console.log("Index : ", value);
        });
        array.set(5, 4);
        fromIndex.set(0);
        valueToFind.set(7);
        fromIndex.set(5);
        fromIndex.set(4);
    }

    // map
    console.log("- map -");
    {
        const array = new Array([1,3,9,4,7,3,8]);
        const mapped = array.Map(new Function(value => {
            return value * 2;
        }));
        mapped[C].on("splice", (start, deleted, inserted) => {
            console.log("splice!! ", start, deleted, inserted);
            console.log("Mapped : ", mapped[O]);
        });
        array.push(1);
        array.splice(1,5,20);
    }

    // reduce
    console.log("- reduce -");
    {
        const array = new Array([1,3,9,4,7,3,8]);
        const initialValue = new Number(0);
        const sum = array.Reduce(new Function((sum, value) => {
            console.log("REDUCE COMPUTE! ", sum, value);
            return sum + value;
        }), initialValue);
        sum[C].on("set", (value) => {
            console.log("SUM : ", value);
        });
        array.push(5);
        array.splice(0,3);
        array.push(11);
        initialValue.set(3);
        array.splice(0);
    }

    // sort
    console.log("- sort -");
    {
        const array = new Array(["hey","hello","jam","tasty"]);
        const sorted = array.Sort();
        sorted[C].on("splice", (start, deleted, inserted) => {
            console.log("splice!! ", start, deleted, inserted);
            console.log("Sorted : ", sorted[O]);
        });
        array.push("ha");
        array.splice(1,2,"apple");
    }
})();
```
## Function
```js
const { Number, Array, Function, Primitive, C, S } = require("changy");

console.log("--- Function test ---");
(() => {

    // call
    console.log("- call -")
    {
        const f = new Function(function (...args) {
            return this + args.reduce((sum, arg) => (sum + arg), 0);
        });

        const a = new Number(1);
        const b = new Number(3);
        const c = new Number(6);

        const args = new Array([b, c]);
        const sum = f.Call(a, args);

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

        const args = new Array([b, c]);
        const sum = f.Apply(a, args);

        sum[C].on("set", value => {
            console.log(`sum : ${value}`);
        });

        a.set(2);
        args.push(7);
        args.set(0, -9);
    }

    //bind
    console.log("- bind -");
    {
        const f = new Function(function (...args) {
            return this + args.reduce((sum, arg) => (sum + arg), 0);
        });

        const a = new Number(0);
        const b = new Number(2);
        const c = new Number(3);

        const bindArgs = new Array([]);
        const bindedF = f.Bind(a, bindArgs);

        const args = new Array([]);
        const sum = bindedF.Call(new Primitive(null), args);

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

        const fToString = f.ToString();
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
```
## Number
```js
const { Number, C, S } = require("changy");

console.log("--- Number test ---");
(() => {
    const num = new Number(4);
    const numChangeListener = value => {
        console.log(value);
    };
    num[C].on("set", numChangeListener);

    const exponential = num.ToExponential();
    exponential[C].on("set", value => {
        console.log(`changed exponential : ${value}`);
    });

    const digit = new Number(0);
    const fixed = num.ToFixed(digit);
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
    const string = num.ToString(radix);
    string[C].on("set", value => {
        console.log(`string fixed : ${value}`)
    });

    num.set(10);
    radix.set(2);
    num.set(11);
})();
```
## Object
```js
const { Object, O, C, Function } = require("changy");

console.log("--- Object test ---");
(() => {
    // keys
    console.log("- keys -");
    {
        const obj = new Object({});
        const keys = Object.Keys(obj);
        keys[C].onAny(() => {
            console.log(keys[O]);
        });
    
        obj.set(8, "eight");
        obj.set(2**32 - 2, "minus 2");
        obj.set(1, "one");
        obj.set("tasty", "jam");
        obj.set(2**32 - 1, "minus 1");
        obj.unset(1);
        obj.set("tasty", "jammm");
    }

    // values
    console.log("- values -");
    {
        const obj = new Object({});
        const values = Object.Values(obj);
        values[C].onAny(() => {
            console.log(values[O]);
        });
    
        obj.set(8, "eight");
        obj.set(2**32 - 2, "minus 2");
        obj.set(1, "one");
        obj.set("tasty", "jam");
        obj.set(2**32 - 1, "minus 1");
        obj.unset(1);
        obj.set("tasty", "jammm");
    }

    // entries
    console.log("- entries -");
    {
        const obj = new Object({});
        const entries = Object.Entries(obj);
        entries[C].onAny(() => {
            console.log(entries[O]);
        });
    
        obj.set(8, "eight");
        obj.set(2**32 - 2, "minus 2");
        obj.set(1, "one");
        obj.set("tasty", "jam");
        obj.set(2**32 - 1, "minus 1");
        obj.unset(1);
        obj.set("tasty", "jammm");
    }

    // map using Entries, Map and FromEntries
    console.log("- map -");
    {
        const obj = new Object({});
        const entries = Object.Entries(obj);
        const mapped = Object.FromEntries(entries.Map(new Function(([prop, value]) => {
            return ["value_of_" + prop, value * 2];
        })));
    
        mapped[C].onAny(() => {
            console.log(mapped[O]);
        });

        obj.set("a", 40);
        obj.set("b", 80);
        obj.set("c", 90);
        obj.unset("a");
    }
})();
```
## Primitive
```js
const { Primitive, C } = require("changy");

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
```
