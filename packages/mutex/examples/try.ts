import { Mutex } from '../src/index.js';

const mutex = new Mutex(void 0);

async function process(name: string): Promise<void> {
  await using lock = mutex.tryLock();
  console.log(name, 'Acquiring lock...');
  if (await lock) {
    console.log(name, 'Acquired lock');
  } else {
    console.log(name, 'Could not acquire lock');
    return;
  }
  console.log(name, 'Releasing lock...');
}

process('A');
process('B');
