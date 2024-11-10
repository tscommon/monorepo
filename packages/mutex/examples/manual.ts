import assert from 'assert/strict';
import { setTimeout } from 'timers/promises';
import { Mutex } from '../src';

const mutex = new Mutex(0);

async function increment(check: number): Promise<void> {
  const lock = mutex.lock();
  try {
    const counter = await lock;
    await setTimeout(Math.random() * 1000);
    assert(counter.value === check);
    counter.value++;
  } finally {
    // It is important to release the lock in a `finally` block.
    // highlight-next-line
    lock.release();
  }
}

async function main(): Promise<void> {
  increment(0);
  increment(1);
  increment(2);
}

main();
