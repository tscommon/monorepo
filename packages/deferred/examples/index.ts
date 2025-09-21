import { Deferred } from '../src/index.js';

const ok = new Deferred<number>();
const err = new Deferred<number>();
const timeout = new Deferred<number>(AbortSignal.timeout(0));

queueMicrotask(() => ok.resolve(42));
queueMicrotask(() => err.reject(new Error('oops')));
setTimeout(() => timeout.resolve(42));

console.log(await Promise.allSettled([ok, err, timeout]));
