import assert from 'assert/strict';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Mutex } from './Mutex';
import { MutexData } from './MutexData';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Mutex', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe('lock', () => {
    test('without locking', async () => {
      let counter = 0;
      async function inc(wait: number) {
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
      const mutex = new Mutex(0);
      async function inc(wait: number) {
        await using lock = mutex.lock();
        const counter = await lock;
        await sleep(wait);
        counter.value++;
        return counter.value;
      }
      const runs = Promise.all([inc(300), inc(200), inc(100)]);
      await vi.advanceTimersToNextTimerAsync();
      await vi.advanceTimersToNextTimerAsync();
      await vi.advanceTimersToNextTimerAsync();
      await expect(runs).resolves.toStrictEqual([1, 2, 3]);
    });
  });

  test('attempts to lock', async () => {
    const mutex = new Mutex(0);
    {
      await using lock1 = mutex.lock();
      await expect(lock1).resolves.toStrictEqual(new MutexData(0));
      {
        await using lock2 = mutex.tryLock();
        await expect(lock2).resolves.toBe(undefined);
      }
    }
  });

  test('releases automatically', async () => {
    const mutex = new Mutex(0);
    {
      await using lock1 = mutex.lock();
      await expect(lock1).resolves.toStrictEqual(new MutexData(0));
    }
    {
      await using lock2 = mutex.tryLock();
      await expect(lock2).resolves.toStrictEqual(new MutexData(0));
    }
  });

  test('releases manually', async () => {
    const mutex = new Mutex(0);
    {
      const lock1 = mutex.lock();
      await expect(lock1).resolves.toStrictEqual(new MutexData(0));
      lock1.release();
    }
    {
      await using lock2 = mutex.tryLock();
      await expect(lock2).resolves.toStrictEqual(new MutexData(0));
    }
  });

  test('releases on exception', async () => {
    const mutex = new Mutex(0);
    async function verify(check: number) {
      await using lock = mutex.lock();
      const counter = await lock;
      assert(counter.value === check);
      return counter.value;
    }
    await expect(() => verify(-1)).rejects.toThrowError();
    await expect(verify(0)).resolves.toBe(0);
  });
});
