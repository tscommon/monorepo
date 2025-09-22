import { Mutex } from '../src/index.js';

const mutex = new Mutex(void 0);

async function process(name: string): Promise<void> {
  await using lock = mutex.lock();
  console.log(name, 'Acquiring lock');
  await lock;
  console.log(name, 'Acquired lock');
  console.log(name, 'Releasing lock');
}

process('A');
process('B');
