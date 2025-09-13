import { describe, expect, it } from 'vitest';
import { Task } from './Task';

describe('Task', () => {
  it('resolves', async () => {
    const task = new Task<number, number>(2);
    task.resolve(task.input ** 2);
    await expect(task).resolves.toBe(4);
  });

  it('rejects', async () => {
    const task = new Task<number, number>(42);
    task.reject(new Error('Test'));
    await expect(task).rejects.toThrow('Test');
  });

  it('implements toStringTag', () => {
    const task = new Task<number, number>(42);
    expect(task[Symbol.toStringTag]).toBe('Task');
  });
});
