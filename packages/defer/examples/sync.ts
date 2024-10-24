import { DeferFunction } from '../src';

// It is important to use the `using` keyword here.
// highlight-next-line
using defer = new DeferFunction();

console.log('start');
defer(() => console.log('a'));
defer(() => console.log('b'));
console.log('end');

// Output:
// start
// end
// b
// a
