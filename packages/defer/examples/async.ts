import { setTimeout } from 'timers/promises';
import { DeferFunction } from '../src';

async function println(message: string) {
  await setTimeout(Math.random() * 1000);
  console.log(message);
}

async function main() {
  // It is important to use the `using` keyword here.
  // highlight-next-line
  await using defer = new DeferFunction();
  console.log('start');
  defer(() => println('a'));
  defer(() => println('b'));
  console.log('end');
}

main();

// Output:
// start
// end
// b
// a
