import { Batch } from '../src';

Batch.from([1, 2, 3, 4, 5], 3).forEach((batch) => {
  console.log(batch);
});

// Output:
// Batch { index: 0, items: [ 1, 2, 3 ] }
// Batch { index: 1, items: [ 4, 5 ] }
