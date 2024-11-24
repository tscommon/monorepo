import type { BatchScheduler } from './BatchScheduler';
import type { Task } from './Task';

export class MicroTaskBatchScheduler<Payload, Result> implements BatchScheduler<Payload, Result> {
  #tasks: Task<Payload, Result>[] = [];
  #onSchedule?: (tasks: readonly Task<Payload, Result>[]) => void | Promise<void>;
  #scheduled = false;
  #signal?: AbortSignal;

  public constructor(signal?: AbortSignal) {
    this.#signal = signal;
  }

  public schedule(task: Task<Payload, Result>): void {
    this.#tasks.push(task);
    if (!this.#scheduled) {
      queueMicrotask(() => {
        if (!this.#signal?.aborted) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.#onSchedule?.(this.#tasks);
          this.#tasks = [];
          this.#scheduled = false;
        }
      });
      this.#scheduled = true;
    }
  }

  public onSchedule(callback: (tasks: readonly Task<Payload, Result>[]) => void | Promise<void>): void {
    this.#onSchedule = callback;
  }
}
