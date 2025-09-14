import { describe, expect, test, vi } from 'vitest';
import { Mutex } from './Mutex';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

vi.useFakeTimers();

describe('Mutex', () => {
  describe('lock', () => {
    test('without locking', async () => {
      let counter = 0;
      async function inc(wait: number): Promise<number> {
        await sleep(wait);
        counter++;
        return counter;
      }
      const runs = Promise.all([inc(300), inc(200), inc(100)]);
      await vi.advanceTimersToNextTimerAsync();
      await vi.advanceTimersToNextTimerAsync();
      await vi.advanceTimersToNextTimerAsync();
      await expect(runs).resolves.toStrictEqual([3, 2, 1]);
    });

    test('with locking', async () => {
      const counter = new Mutex(0);
      async function inc(wait: number): Promise<number> {
        await using lock = counter.lock();
        const data = await lock;
        await sleep(wait);
        data.value++;
        return data.value;
      }
      const runs = Promise.all([inc(300), inc(200), inc(100)]);
      await vi.advanceTimersToNextTimerAsync();
      await vi.advanceTimersToNextTimerAsync();
      await vi.advanceTimersToNextTimerAsync();
      await expect(runs).resolves.toStrictEqual([1, 2, 3]);
    });
  });

  test('attempts to lock', async () => {
    const mutex = new Mutex(undefined);
    {
      await using lock1 = mutex.lock();
      await expect(lock1).resolves.toBeDefined();
      {
        await using lock2 = mutex.tryLock();
        await expect(lock2).resolves.toBe(undefined);
      }
    }
  });

  test('releases automatically', async () => {
    const mutex = new Mutex(undefined);
    {
      await using lock = mutex.lock();
      await expect(lock).resolves.toBeDefined();
    }
    {
      await using lock = mutex.tryLock();
      await expect(lock).resolves.toBeDefined();
    }
  });

  test('releases manually', async () => {
    const mutex = new Mutex(undefined);
    {
      const lock = mutex.lock();
      await expect(lock).resolves.toBeDefined();
      lock.release();
    }
    {
      await using lock = mutex.tryLock();
      await expect(lock).resolves.toBeDefined();
    }
  });

  test('releases on exception', async () => {
    const mutex = new Mutex(undefined);
    {
      try {
        await using _ = mutex.lock();
        throw new Error('Test');
      } catch {
        // ignore
      }
    }
    {
      await using lock = mutex.tryLock();
      await expect(lock).resolves.toBeDefined();
    }
  });
});
