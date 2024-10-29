import type { BatchScheduler } from './BatchScheduler';
import type { ResolverCache } from './ResolverCache';
import { Task } from './Task';

export class BatchExecutor<Payload, Result> {
  readonly #cache: ResolverCache<Payload, Result>;
  readonly #scheduler: BatchScheduler<Payload, Result>;

  public constructor(cache: ResolverCache<Payload, Result>, scheduler: BatchScheduler<Payload, Result>) {
    this.#cache = cache;
    this.#scheduler = scheduler;
    Object.freeze(this);
  }

  public execute(payload: Payload, signal?: AbortSignal): Promise<Result> {
    let task = this.#cache.get(payload);
    if (!task) {
      task = new Task<Payload, Result>(payload);
      task.signal.addEventListener('abort', () => this.purge(payload), { once: true });
      this.#cache.set(payload, task);
      this.#scheduler.schedule(task);
    }
    return task.share(signal);
  }

  public purge(payload: Payload): boolean {
    return this.#cache.delete(payload);
  }
}
