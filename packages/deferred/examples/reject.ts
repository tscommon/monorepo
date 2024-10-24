import { Deferred } from '../src';

async function main() {
  const deferred = new Deferred<number>();
  process.nextTick(() => deferred.reject(new Error('Oops!')));
  // expect-error-next-line
  await deferred; // Error: Oops!
}

main();
