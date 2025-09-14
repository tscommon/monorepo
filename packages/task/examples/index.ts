import { Task } from '../src';

const task = new Task<number, number>(2);

setTimeout(() => {
  // @code/highlight
  task.resolve(task.input ** 2); // Resolve the task with the square of the input
});

task.then(console.log); // 4
