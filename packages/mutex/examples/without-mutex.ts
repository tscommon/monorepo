import assert from 'assert/strict';
import { setTimeout } from 'timers/promises';

let counter = 0;

async function increment(check: number) {
  await setTimeout(Math.random() * 1000);
  /**
   * Here we are not using a mutex to protect the counter.
   * This means that the counter is not protected from concurrent access.
   * This can lead to an assertion error.
   */
  // expect-error-next-line
  assert(counter === check);
  counter++;
}

async function main() {
  increment(0);
  increment(1);
  increment(2);
}

main();
