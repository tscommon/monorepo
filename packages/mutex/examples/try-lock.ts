import { Option } from "@tscommon/option";
import { Mutex } from "../src";

interface Counter {
  value: number;
}

async function process(name: string, mutex: Mutex<Counter>) {
  console.log(`[${name}]: Acquiring lock`);
  await using lock = mutex.tryLock();
  const counter = await lock;
  switch (counter) {
    case Option.none: {
      console.log(`[${name}]: Failed to acquire lock`);
      return;
    }
    default: {
      console.log(`[${name}]: Lock acquired`);
      counter.unwrap().value++;
      console.log(`[${name}]: Incremented value`);
    }
  }
}

async function main() {
  const mutex = new Mutex<Counter>({ value: 0 });
  await Promise.all([
    process("async-1", mutex),
    process("async-2", mutex),
    process("async-3", mutex),
  ]);
}

main();

// Output:
// [async-1]: Acquiring lock
// [async-2]: Acquiring lock
// [async-3]: Acquiring lock
// [async-2]: Failed to acquire lock
// [async-3]: Failed to acquire lock
// [async-1]: Lock acquired
// [async-1]: Incremented value
