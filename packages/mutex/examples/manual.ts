import { Mutex } from "../src";

import assert from "node:assert/strict";

interface Counter {
  value: number;
}

async function main() {
  const mutex = new Mutex<Counter>({ value: 0 });
  console.log("Acquiring lock");
  const lock = mutex.lock();
  const counter = await lock;
  console.log("Lock acquired");
  try {
    assert(counter.value === 0);
    console.log("Value is as expected");
  } finally {
    lock.release();
    console.log("Lock released");
  }
}

main();
