import { Deferred } from '../src';

async function main() {
  const deferred = new Deferred<number>();
  process.nextTick(() => deferred.resolve(42));
  console.log(await deferred); // 42
}

main();
