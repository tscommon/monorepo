import { Deque } from '../src/index.js';

const deque = new Deque<number>();

deque.push(1);
deque.push(2);
deque.push(3);

console.log(Array.from(deque)); // [1, 2, 3]

deque.pop();
console.log(Array.from(deque)); // [1, 2]

deque.unshift(0);
console.log(Array.from(deque)); // [0, 1, 2]

deque.shift();
console.log(Array.from(deque)); // [1, 2]
