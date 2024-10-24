import { Readable } from 'stream';
import { Batch } from '../src';

async function main() {
  const items = Readable.from([1, 2, 3, 4, 5]);

  for await (const batch of Batch.fromAsync(items, 3)) {
    console.log(batch);
  }
}

main();

// Output:
// Batch { index: 0, items: [ 1, 2, 3 ] }
// Batch { index: 1, items: [ 4, 5 ] }
