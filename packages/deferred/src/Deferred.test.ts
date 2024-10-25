import { describe, expect, it, vi } from 'vitest';
import { Deferred } from './Deferred';
import { DeferredState } from './DeferredState';

describe('Deferred', () => {
  it('is pending by default', () => {
    const deferred = new Deferred<number>();
    expect(deferred.state).toBe(DeferredState.Pending);
  });

  it('resolves to a value', async () => {
    const deferred = new Deferred<number>();
    deferred.resolve(42);
    await expect(deferred).resolves.toBe(42);
    expect(deferred.state).toBe(DeferredState.Fulfilled);
  });

  it('rejects with a reason', async () => {
    const error = new Error('error');
    const deferred = new Deferred<number>();
    deferred.reject(error);
    await expect(async () => deferred).rejects.toThrowError(error);
    expect(deferred.state).toBe(DeferredState.Rejected);
  });

  it('is immutable', () => {
    const deferred = new Deferred<number>();
    expect(() => Object.assign(deferred, { test: 1 })).toThrowError(TypeError);
  });

  it('implements toStringTag', () => {
    const deferred = new Deferred<number>();
    expect(deferred[Symbol.toStringTag]).toBe('Deferred');
  });

  it('implements catch', async () => {
    const deferred = new Deferred<number>();
    const onrejected = vi.fn();
    const error = new Error('error');
    deferred.reject(error);
    await deferred.catch(onrejected);
    expect(onrejected).toHaveBeenCalled();
  });

  it('implements finally', async () => {
    const deferred = new Deferred<number>();
    const onfinally = vi.fn();
    deferred.resolve(42);
    await deferred.finally(onfinally);
    expect(onfinally).toHaveBeenCalled();
  });
});
