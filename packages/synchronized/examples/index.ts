import { synchronized } from '../src/index.js';

class MyObject {
  @synchronized // Decorator to synchronize method calls
  public async process(id: string): Promise<void> {
    console.log(id, 'Started');
    return new Promise((resolve) => {
      queueMicrotask(() => {
        console.log(id, 'Ended');
        resolve();
      });
    });
  }
}

const o = new MyObject();

o.process('A');
o.process('B');
o.process('C');
