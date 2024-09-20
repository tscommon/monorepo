import { DeferFunction } from "../src";

using defer = new DeferFunction(); // It is important to use the `using` keyword here.

console.log("start");
defer(() => console.log("a"));
defer(() => console.log("b"));
console.log("end");

// Output:
// start
// end
// b
// a
