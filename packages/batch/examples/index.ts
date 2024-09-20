import { Batch } from "../src";

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

for (const batch of Batch.from(items, 3)) {
  console.log(batch);
}

// Output:
// Batch { index: 0, items: [ 1, 2, 3 ] }
// Batch { index: 1, items: [ 4, 5, 6 ] }
// Batch { index: 2, items: [ 7, 8, 9 ] }
// Batch { index: 3, items: [ 10 ] }
