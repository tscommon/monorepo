import { Deferred, DeferredState } from '../src';

async function main(): Promise<void> {
  const deferred = new Deferred<number>();
  process.nextTick(() => {
    deferred.resolve(42);
    console.log(deferred.state === DeferredState.Fulfilled); // true
  });
  const value = await deferred;
  console.log(value); // 42
}

main();
