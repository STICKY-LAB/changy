const { Array, Number, Function, O, C, S } = require("../dist/index");

console.log("--- Array.FromLength test ---");
{
    const length = new Number(1);
    const array = Array.FromLength(length);
    const mapped = array.Map(new Function(() => Math.floor(Math.random() * 100) + 1));
    mapped[C].on("splice", (start, deleted, inserted) => {
        console.log("splice!! ", start, deleted, inserted);
        console.log("mapped : ", mapped[O]);
    });

    length.set(2);
    length.set(10);
    length.set(3);
}