import { Readable } from "stream";
import { Batch } from "../src";

async function main() {
  for await (const batch of Batch.fromAsync(
    Readable.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    3,
  )) {
    console.log(batch);
  }
}

main();

// Output:
// Batch { index: 0, items: [ 1, 2, 3 ] }
// Batch { index: 1, items: [ 4, 5, 6 ] }
// Batch { index: 2, items: [ 7, 8, 9 ] }
// Batch { index: 3, items: [ 10 ] }
