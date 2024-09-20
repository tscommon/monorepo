import { Box } from "../src";

function inc(counter: Box<number>) {
  counter.value++;
}

const counter = new Box(0);
inc(counter);
console.log(counter.value); // 1
