import assert from 'assert/strict';
import { setTimeout } from 'timers/promises';
import { Mutex } from '../src';

const mutex = new Mutex(0);

async function increment(check: number): Promise<void> {
  // It is important to use the `using` statement to acquire the lock.
  // highlight-next-line
  await using lock = mutex.lock();
  // We use the `await` keyword to wait for the lock to be acquired.
  const counter = await lock;
  await setTimeout(Math.random() * 1000);
  assert(counter.value === check);
  counter.value++;
} // The lock is automatically released when the `using` block ends.

async function main(): Promise<void> {
  increment(0);
  increment(1);
  increment(2);
}

main();
