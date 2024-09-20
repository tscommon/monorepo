import { Deferred } from "../src";

const deferred = new Deferred<number>();
deferred.resolve(42);
deferred.then(console.log); // 42
