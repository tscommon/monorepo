import { Batch } from '../src';

function isEven(value: number) {
  return value % 2 === 0;
}

for (const batch of Batch.from([1, 2, 3, 4, 5], 2, isEven)) {
  console.log(batch);
}

// Output:
// Batch { index: 0, items: [ 2, 4 ] }
// Batch { index: 1, items: [ 6, 8 ] }
// Batch { index: 2, items: [ 10 ] }
