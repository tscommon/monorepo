import { setTimeout } from 'timers/promises';
import { synchronized } from '../src';

class SynchronizedObject {
  // highlight-next-line
  @synchronized // Executes the method serially
  public async execute(value: number): Promise<void> {
    await setTimeout(Math.random() * 1000);
    console.log(value);
  }
}

const obj = new SynchronizedObject();

obj.execute(1);
obj.execute(2);
obj.execute(3);

// 1
// 2
// 3
