import { Mutex } from "../src";

import assert from "node:assert/strict";

interface Counter {
  value: number;
}

async function process(name: string, mutex: Mutex<Counter>, check: number) {
  {
    console.log(`[${name}]: Acquiring lock`);
    await using lock = mutex.lock(); // <- This makes the lock automatic
    const counter = await lock;
    console.log(`[${name}]: Lock acquired`);
    assert(counter.value === check);
    console.log(`[${name}]: Value is as expected`);
    counter.value += 1;
    console.log(`[${name}]: Incremented value`);
  }
  console.log(`[${name}]: Lock released`);
}

async function main() {
  const mutex = new Mutex<Counter>({ value: 0 });
  {
    process("async-1", mutex, 0);
    process("async-2", mutex, 1);
    process("async-3", mutex, 2);

    console.log("[main]: Acquiring lock");
    await using lock = mutex.lock();
    const counter = await lock;
    console.log("[main]: Lock acquired");
    assert(counter.value === 3);
    console.log("[main]: Value is as expected");
  }
  console.log("[main]: Lock released");
}

main();

// Output:
// [async-1]: Acquiring lock
// [async-2]: Acquiring lock
// [async-3]: Acquiring lock
// [main]: Acquiring lock
// [async-1]: Lock acquired
// [async-1]: Value is as expected
// [async-1]: Incremented value
// [async-1]: Lock released
// [async-2]: Lock acquired
// [async-2]: Value is as expected
// [async-2]: Incremented value
// [async-2]: Lock released
// [async-3]: Lock acquired
// [async-3]: Value is as expected
// [async-3]: Incremented value
// [async-3]: Lock released
// [main]: Lock acquired
// [main]: Value is as expected
// [main]: Lock released
