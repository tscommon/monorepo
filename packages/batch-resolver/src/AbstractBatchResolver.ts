/* eslint-disable @typescript-eslint/unbound-method */

import { Task } from '@tscommon/task';
import { RedundantTaskError } from './RedundantTaskError';

export abstract class AbstractBatchResolver<Input, Output, Key = Input> {
  #tasks = new Map<Key, Task<Input, Output>>();
  readonly #schedule = typeof window === 'undefined' ? process.nextTick : /* v8 ignore next */ queueMicrotask;
  readonly #callback = this.#onSchedule.bind(this);

  public abstract getKey(input: Input): Key;

  public resolve(input: Input): Task<Input, Output> {
    const key = this.getKey(input);
    let task = this.#tasks.get(key);
    const scheduled = this.#tasks.size > 0;
    if (task) {
      this.#tasks.delete(key);
      task.reject(new RedundantTaskError());
      task = undefined;
    }
    task = new Task<Input, Output>(input);
    this.#tasks.set(key, task);
    if (!scheduled) {
      this.#schedule(this.#callback);
    }
    return task;
  }

  protected abstract onResolve(tasks: Map<Key, Task<Input, Output>>): Promise<void>;

  async #onSchedule(): Promise<void> {
    const tasks = this.#tasks;
    this.#tasks = new Map<Key, Task<Input, Output>>();
    try {
      await this.onResolve(tasks);
      if (tasks.size > 0) {
        throw new Error('Task not resolved');
      }
    } catch (e) {
      tasks.forEach((task) => {
        task.reject(e);
      });
    }
  }
}
