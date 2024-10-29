import { BatchExecutor } from './BatchExecutor';
import type { BatchSchedulerFactory } from './BatchSchedulerFactory';
import type { ResolverCacheFactory } from './ResolverCacheFactory';
import type { Task } from './Task';

export interface BatchResolverOptions<Payload, Result> {
  readonly cacheFactory: ResolverCacheFactory<Payload, Result>;
  readonly schedulerFactory: BatchSchedulerFactory<Payload, Result>;
  readonly signal?: AbortSignal;
}

export abstract class BatchResolver<Context extends symbol | object, Payload, Result> {
  readonly #caches: ResolverCacheFactory<Payload, Result>;
  readonly #executors = new WeakMap<Context, BatchExecutor<Payload, Result>>();
  readonly #schedulers: BatchSchedulerFactory<Payload, Result>;
  readonly #signal?: AbortSignal;

  public constructor({ signal, cacheFactory, schedulerFactory }: BatchResolverOptions<Payload, Result>) {
    this.#caches = cacheFactory;
    this.#schedulers = schedulerFactory;
    this.#signal = signal;
    Object.freeze(this);
  }

  public resolve(context: Context, payload: Payload, signal?: AbortSignal): Promise<Result> {
    signal?.throwIfAborted();
    let executor = this.#executors.get(context);
    if (!executor) {
      const cache = this.#caches.createCache();
      const scheduler = this.#schedulers.createScheduler(this.#signal);
      scheduler.onSchedule((tasks) => this.onResolve(context, tasks, this.#signal));
      executor = new BatchExecutor(cache, scheduler);
      this.#executors.set(context, executor);
    }
    return executor.execute(payload, signal);
  }

  public purge(context: Context, payload?: Payload): boolean {
    return payload ? this.#executors.get(context)?.purge(payload) === true : this.#executors.delete(context);
  }

  protected abstract onResolve(
    context: Context,
    tasks: readonly Task<Payload, Result>[],
    signal?: AbortSignal,
  ): void | Promise<void>;
}
