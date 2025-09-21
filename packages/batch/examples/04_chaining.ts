import { Batch } from '../src/index.js';

Batch.from([1, 2, 3, 4, 5], 3).forEach((batch) => {
  console.log(batch);
});
