import { describe, expect, test } from 'vitest';
import { Deferred } from './Deferred';

describe('Deferred', () => {
  test('resolves to value', async () => {
    const deferred = new Deferred<number>();
    deferred.resolve(42);
    await expect(deferred).resolves.toBe(42);
  });

  test('rejects with reason', async () => {
    const error = new Error('error');
    const deferred = new Deferred<number>();
    deferred.reject(error);
    await expect(async () => deferred).rejects.toThrowError(error);
  });

  test('is immutable', () => {
    const deferred = new Deferred<number>();
    expect(() => Object.assign(deferred, { test: 1 })).toThrowError(TypeError);
  });
});
