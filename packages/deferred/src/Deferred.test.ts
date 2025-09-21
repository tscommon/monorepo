import { describe, expect, it, vi } from 'vitest';
import { Deferred } from './Deferred.js';
import { DeferredState } from './DeferredState.js';

describe('Deferred', () => {
  it('is pending by default', () => {
    const deferred = new Deferred<number>();
    expect(deferred.state).toBe(DeferredState.Pending);
  });

  it('resolves to a value', async () => {
    const deferred = new Deferred<number>(AbortSignal.timeout(1000));
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

  it('implements catch', async () => {
    const deferred = new Deferred<number>();
    const onrejected = vi.fn();
    const error = new Error('error');
    deferred.reject(error);
    await deferred.then(undefined, onrejected);
    expect(onrejected).toHaveBeenCalled();
  });

  it('implements finally', async () => {
    const deferred = new Deferred<number>();
    const onfinally = vi.fn();
    deferred.resolve(42);
    await deferred.then(onfinally, onfinally);
    expect(onfinally).toHaveBeenCalled();
  });

  it('accepts abort signal', async () => {
    const controller = new AbortController();
    const deferred = new Deferred<number>(controller.signal);
    controller.abort();
    await expect(deferred).rejects.toThrowError('aborted');
  });
});
