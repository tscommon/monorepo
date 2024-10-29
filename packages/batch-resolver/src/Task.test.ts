import { describe, expect, it } from 'vitest';
import { Task } from './Task';

describe('Task', () => {
  it('is frozen', () => {
    const task = new Task<string, string>('input');
    expect(Object.isFrozen(task)).toBe(true);
  });

  it('can be shared', async () => {
    const task = new Task<string, string>('input');
    task.resolve('output');
    await expect(task.share()).resolves.toBe('output');
  });

  it('can be aborted', async () => {
    const task = new Task<string, string>('input');
    const controller = new AbortController();
    const sharedRequest = task.share(controller.signal);
    controller.abort();
    await expect(sharedRequest).rejects.toThrowError(DOMException);
  });

  it('does not abort if it is shared', async () => {
    const task = new Task<string, string>('input');
    const controller = new AbortController();
    const shared1 = task.share(controller.signal);
    const shared2 = task.share();
    controller.abort();
    task.resolve('output');
    await expect(shared1).rejects.toThrowError(DOMException);
    await expect(shared2).resolves.toBe('output');
  });
});
