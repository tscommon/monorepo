import { Deferred, DeferredState } from '../src';

async function main(): Promise<void> {
  const deferred = new Deferred<number>();
  process.nextTick(() => {
    deferred.reject(new Error('Oops!'));
    console.log(deferred.state === DeferredState.Rejected); // true
  });
  // expect-error-next-line
  await deferred; // Error: Oops!
}

main();
