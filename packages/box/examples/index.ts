import { Box } from '../src';

function increment(counter: Box<number>): void {
  counter.value++;
}

const counter = new Box(0);

increment(counter);

console.log(counter.value); // 1
