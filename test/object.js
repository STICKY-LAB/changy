const { Primitive, Object, Array, Number, O, C, S, Function } = require("../dist/index");

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