import { Mutex } from '../src/index.js';

const mutex = new Mutex(void 0);

async function process(name: string): Promise<void> {
  const lock = mutex.lock();
  try {
    console.log(name, 'Acquiring lock...');
    await lock;
    console.log(name, 'Acquired lock');
  } finally {
    lock.release(); // You must release the lock
    console.log(name, 'Releasing lock...');
  }
}

process('A');
process('B');
