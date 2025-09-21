import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AbstractAsyncBatchResolver } from './AbstractAsyncBatchResolver.js'; // Adjust the import path as needed
import { DeduplicationStrategy } from './DeduplicationStrategy.js';
import { Task } from './Task.js';
import { TaskCancelledError } from './TaskCancelledError.js';
import { TaskUnresolvedError } from './TaskUnresolvedError.js';

// A concrete implementation for testing purposes
class TestResolver extends AbstractAsyncBatchResolver<string, string, string> {
  // We use a Vitest mock function for onResolve to spy on it and control its behavior per test.
  public onResolve = vi.fn(async (tasks: Map<string, Task<string, string>>) => {
    // Default behavior: resolve each task with its key
    for (const [key, task] of tasks.entries()) {
      task.resolve(`Resolved: ${key}`);
    }
  });

  public getKey(input: string): string {
    return input;
  }
}

describe('AbstractAsyncBatchResolver', () => {
  let resolver: TestResolver;

  // Use fake timers to control setImmediate and test batching deterministically
  beforeEach(() => {
    vi.useFakeTimers();
    resolver = new TestResolver();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Core Batching and Resolution', () => {
    it('should batch multiple calls within the same event loop tick into a single onResolve call', async () => {
      const promise1 = resolver.get('task1');
      const promise2 = resolver.get('task2');

      // onResolve should not have been called yet
      expect(resolver.onResolve).not.toHaveBeenCalled();

      // Advance timers to trigger the setImmediate callback
      await vi.runAllTimersAsync();

      expect(resolver.onResolve).toHaveBeenCalledTimes(1);
      const tasksInBatch = resolver.onResolve.mock.calls[0]![0];
      expect(tasksInBatch.size).toBe(2);
      expect(tasksInBatch.has('task1')).toBe(true);
      expect(tasksInBatch.has('task2')).toBe(true);

      // Check that the promises resolve correctly
      await expect(promise1).resolves.toBe('Resolved: task1');
      await expect(promise2).resolves.toBe('Resolved: task2');
    });

    it('should handle an empty batch gracefully', async () => {
      await vi.runAllTimersAsync();
      expect(resolver.onResolve).not.toHaveBeenCalled();
    });

    it('should cache resolved tasks and not call onResolve again for the same key', async () => {
      const promise1 = resolver.get('task1');
      await vi.runAllTimersAsync();
      await promise1;

      expect(resolver.onResolve).toHaveBeenCalledTimes(1);

      // Call get again for the same key
      const promise2 = resolver.get('task1');

      // It should resolve immediately with the cached value
      await expect(promise2).resolves.toBe('Resolved: task1');

      // No new batch should be scheduled or processed
      await vi.runAllTimersAsync();
      expect(resolver.onResolve).toHaveBeenCalledTimes(1);
    });
  });

  describe('Deduplication Strategies', () => {
    it('[Merge] should return the same promise instance for the same key by default', async () => {
      const promise1 = resolver.get('task1');
      const promise2 = resolver.get('task1');

      expect(promise1).toBe(promise2);

      await vi.runAllTimersAsync();
      expect(resolver.onResolve).toHaveBeenCalledTimes(1);
      expect(resolver.onResolve.mock.calls[0]![0].size).toBe(1);
    });

    it('[Merge] should return the same rejected promise instance for the same key', async () => {
      // Configure onResolve to reject the task
      resolver.onResolve.mockImplementation(async (tasks) => {
        tasks.forEach((task) => task.reject(new Error('Failed!')));
      });

      const promise1 = resolver.get('task1');
      vi.runAllTimers();
      await expect(promise1).rejects.toThrow('Failed!');

      // Call get again for the same key
      const promise2 = resolver.get('task1');
      expect(promise1).toBe(promise2);

      await expect(promise2).rejects.toThrow('Failed!');

      // onResolve should have been called only once
      expect(resolver.onResolve).toHaveBeenCalledTimes(1);
    });

    it('[Cancel] should reject the original task and create a new one', async () => {
      const promise1 = resolver.get('task1');
      const promise2 = resolver.get('task1', DeduplicationStrategy.Cancel);

      expect(promise1).not.toBe(promise2);
      await expect(promise1).rejects.toThrow(TaskCancelledError);

      await vi.runAllTimersAsync();

      // onResolve should be called for the second task
      expect(resolver.onResolve).toHaveBeenCalledTimes(1);
      await expect(promise2).resolves.toBe('Resolved: task1');
    });

    it('[Retry] should create a new task only if the previous one failed', async () => {
      // 1. Make the first attempt fail
      resolver.onResolve.mockImplementation(async (tasks) => {
        tasks.forEach((task) => task.reject(new Error('Failed!')));
      });

      const promise1 = resolver.get('task1');
      vi.runAllTimers();
      await expect(promise1).rejects.toThrow('Failed!');

      // 2. Reset mock to succeed for the retry
      resolver.onResolve.mockImplementation(async (tasks) => {
        tasks.forEach((task, key) => task.resolve(`Retry success: ${key}`));
      });

      const promise2 = resolver.get('task1', DeduplicationStrategy.Retry);
      expect(promise1).not.toBe(promise2);

      await vi.runAllTimersAsync();
      await expect(promise2).resolves.toBe('Retry success: task1');

      // onResolve was called twice
      expect(resolver.onResolve).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should reject all tasks in a batch if onResolve throws an error', async () => {
      const testError = new Error('Global batch failure');
      resolver.onResolve.mockRejectedValue(testError);

      const promise1 = resolver.get('task1');
      const promise2 = resolver.get('task2');

      vi.runAllTimers();

      await expect(promise1).rejects.toThrow(testError);
      await expect(promise2).rejects.toThrow(testError);
    });

    it('should reject a task with TaskUnresolvedError if onResolve does not settle it', async () => {
      // Configure onResolve to only resolve 'task1' and ignore 'task2'
      resolver.onResolve.mockImplementation(async (tasks) => {
        tasks.get('task1')?.resolve('Resolved: task1');
      });

      const promise1 = resolver.get('task1');
      const promise2 = resolver.get('task2');

      vi.runAllTimers();

      await expect(promise1).resolves.toBe('Resolved: task1');
      await expect(promise2).rejects.toThrow(TaskUnresolvedError);
    });
  });

  describe('Instance Methods', () => {
    it('clear() should reject all pending tasks and clear the batch', async () => {
      const promise1 = resolver.get('task1');
      const promise2 = resolver.get('task2');

      resolver.clear();

      await expect(promise1).rejects.toThrow(TaskCancelledError);
      await expect(promise2).rejects.toThrow(TaskCancelledError);

      // The scheduled batch should now be empty and do nothing
      await vi.runAllTimersAsync();
      expect(resolver.onResolve).not.toHaveBeenCalled();
    });

    it('delete() should cancel a pending task and remove it from the batch and cache', async () => {
      const promise1 = resolver.get('task1');
      const promise2 = resolver.get('task2');

      const wasDeleted = resolver.delete('task1');
      expect(wasDeleted).toBe(true);

      await expect(promise1).rejects.toThrow(TaskCancelledError);

      await vi.runAllTimersAsync();

      // The batch should now only contain task2
      expect(resolver.onResolve).toHaveBeenCalledTimes(1);
      const tasksInBatch = resolver.onResolve.mock.calls[0]![0];
      expect(tasksInBatch.size).toBe(1);
      expect(tasksInBatch.has('task2')).toBe(true);

      await expect(promise2).resolves.toBe('Resolved: task2');
      expect(resolver.has('task1')).toBe(false);
    });

    it('has() should return true for pending or cached tasks, and false otherwise', async () => {
      expect(resolver.has('task1')).toBe(false);
      resolver.get('task1');
      expect(resolver.has('task1')).toBe(true);

      await vi.runAllTimersAsync();

      // Still true after resolution (caching)
      expect(resolver.has('task1')).toBe(true);
    });
  });

  describe('Instance properties', () => {
    it('size should return the number of tracked tasks', async () => {
      expect(resolver.size).toBe(0);
      resolver.get('task1');
      expect(resolver.size).toBe(1);
      resolver.get('task2');
      expect(resolver.size).toBe(2);

      await vi.runAllTimersAsync();
      expect(resolver.size).toBe(2); // Still 2 because they are cached

      resolver.delete('task1');
      expect(resolver.size).toBe(1);

      resolver.clear();
      expect(resolver.size).toBe(0);
    });
  });
});
