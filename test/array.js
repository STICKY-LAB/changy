const { Primitive, Object, Array, Number, Function, O, C, S } = require("../dist/index");

console.log("--- Array test ---");
(() => {

    // concat, push / set, splice
    console.log("- concat, push / set, splice -");
    {
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
        const everyResult = array.every(new Function(value => {
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
        const filtered = array.filter(new Function(value => {
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
        const found = array.findIndex(new Function(value => {
            console.log("CHECK " + value);
            return value > 5;
        }));
        const foundElement = array.find(new Function(value => {
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
        const sliced = array.slice(begin, end);
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
        const includes = array.includes(valueToFind, fromIndex);
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
        const includes = array.indexOf(valueToFind, fromIndex);
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
        const mapped = array.map(new Function(value => {
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
        const sum = array.reduce(new Function((sum, value) => {
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
})();
