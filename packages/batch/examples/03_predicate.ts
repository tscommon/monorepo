import { Batch } from '../src/index.js';

console.log(Array.from(Batch.from([1, 2, 3, 4, 5], 2, (v) => v % 2 === 0)));
