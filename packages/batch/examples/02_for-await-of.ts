import { Batch } from '../src/index.js';

async function* getSource() {
  for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => setTimeout(resolve));
    yield i;
  }
}

console.log(await Array.fromAsync(Batch.fromAsync(getSource(), 3)));
