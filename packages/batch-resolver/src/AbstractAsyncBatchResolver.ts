import { DeferredState } from '@tscommon/deferred';
import { DeduplicationStrategy } from './DeduplicationStrategy.js';
import { Task } from './Task.js';
import { TaskCancelledError } from './TaskCancelledError.js';
import { TaskUnresolvedError } from './TaskUnresolvedError.js';

function hasFlag(value: number, flag: number): boolean {
  return (value & flag) === flag;
}

/**
 * Batches multiple asynchronous calls within a single operation, caching results.
 *
 * {@includeCode ../examples/index.ts}
 *
 * @template Input The type of the individual item to be resolved.
 * @template Result The type of the result for an individual item.
 * @template Key The type of the key used for deduplication.
 */
export abstract class AbstractAsyncBatchResolver<Input, Result, Key = Input> {
  private readonly _tasks = new Map<Key, Task<Input, Result>>();
  private _batch = new Map<Key, Task<Input, Result>>();
  private readonly _onResolveCallback = this._onResolve.bind(this);
  private readonly _deduplication: DeduplicationStrategy;
  private readonly _schedule = typeof setImmediate === 'function' ? setImmediate : /* v8 ignore next */ queueMicrotask;

  public get size(): number {
    return this._tasks.size;
  }

  public constructor(deduplication = DeduplicationStrategy.Merge) {
    this._deduplication = deduplication;
  }

  /**
   * Extracts a unique key from an input item for deduplication.
   * @param input The input item.
   * @returns A unique key.
   */
  protected abstract getKey(input: Input): Key;

  /**
   * The core logic for processing a batch of tasks.
   * This method must resolve or reject every task in the provided map.
   * @param tasks A map of tasks to be processed.
   */
  protected abstract onResolve(tasks: Map<Key, Task<Input, Result>>): Promise<void>;

  /**
   * Requests a result for a given input, batching the request and utilizing an internal cache.
   * @param input The input item to resolve.
   * @param deduplication The deduplication strategy to use for this request. Defaults to the instance's strategy if not provided.
   * @param signal An optional AbortSignal to cancel the request.
   * @returns A promise-like task that resolves with the result.
   */
  public get(input: Input, deduplication = this._deduplication, signal?: AbortSignal): PromiseLike<Result> {
    const key = this.getKey(input);
    const existingTask = this._tasks.get(key);

    if (existingTask) {
      if (hasFlag(deduplication, DeduplicationStrategy.Cancel)) {
        existingTask.reject(new TaskCancelledError());
      } else if (existingTask.state === DeferredState.Rejected) {
        if (!hasFlag(deduplication, DeduplicationStrategy.Retry)) {
          return existingTask; // Return the rejected task as is.
        }
      } else {
        return existingTask; // Always return cached task.
      }
    }

    if (this._batch.size === 0) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this._schedule(this._onResolveCallback);
    }

    const newTask = new Task<Input, Result>(input, signal);
    this._tasks.set(key, newTask);
    this._batch.set(key, newTask);

    return newTask;
  }

  /**
   * Checks if a task for the given input is pending or cached.
   * @param input The input item to check.
   * @returns True if a task exists, false otherwise.
   */
  public has(input: Input): boolean {
    const key = this.getKey(input);
    return this._tasks.has(key);
  }

  /**
   * Deletes a pending or cached task, rejecting it if still unresolved.
   * @param input The input item whose task should be deleted.
   * @returns True if a task was found and deleted, false otherwise.
   */
  public delete(input: Input): boolean {
    const key = this.getKey(input);
    const task = this._tasks.get(key);
    task?.reject(new TaskCancelledError());
    this._batch.delete(key);
    this._tasks.delete(key);
    return task !== undefined;
  }

  /**
   * Clears all pending and cached tasks, rejecting any that are still unresolved.
   */
  public clear(): void {
    if (this._tasks.size > 0) {
      const error = new TaskCancelledError();
      this._tasks.forEach((task) => {
        if (task.state === DeferredState.Pending) {
          task.reject(error);
        }
      });
      this._tasks.clear();
      this._batch.clear();
    }
  }

  private async _onResolve(): Promise<void> {
    if (this._batch.size > 0) {
      const batchToProcess = this._batch;
      this._batch = new Map<Key, Task<Input, Result>>();

      try {
        await this.onResolve(batchToProcess);
      } catch (error) {
        batchToProcess.forEach((task) => {
          if (task.state === DeferredState.Pending) {
            task.reject(error as Error);
          }
        });
        return;
      }

      if (batchToProcess.size > 0) {
        // Ensure no promises are left hanging if onResolve misses some.
        const unresolvedError = new TaskUnresolvedError();
        batchToProcess.forEach((task) => {
          if (task.state === DeferredState.Pending) {
            task.reject(unresolvedError);
          }
        });
      }
    }
  }
}
