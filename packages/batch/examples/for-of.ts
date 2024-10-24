import { Batch } from '../src';

const items = [1, 2, 3, 4, 5];

for (const batch of Batch.from(items, 3)) {
  console.log(batch);
}

// Output:
// Batch { index: 0, items: [ 1, 2, 3 ] }
// Batch { index: 1, items: [ 4, 5 ] }
