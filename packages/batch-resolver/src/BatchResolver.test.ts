import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BatchResolver } from './BatchResolver';
import { MicroTaskBatchScheduler } from './MicroTaskBatchScheduler';
import { Task } from './Task';

const onResolve = vi.fn((_context: symbol, tasks: readonly Task<number, string>[]): void | Promise<void> => {
  tasks.forEach((task) => {
    task.resolve('a'.repeat(task.payload));
  });
});

class TestResolver extends BatchResolver<symbol, number, string> {
  protected override onResolve(context: symbol, tasks: readonly Task<number, string>[]): void | Promise<void> {
    return onResolve(context, tasks);
  }
}

describe('BatchResolver', () => {
  const context = Symbol();
  let cache: Map<number, Task<number, string>>;
  let resolver: TestResolver;
  let scheduler: MicroTaskBatchScheduler<number, string>;

  beforeEach(() => {
    cache = new Map<number, Task<number, string>>();
    scheduler = new MicroTaskBatchScheduler<number, string>();
    resolver = new TestResolver({
      cacheFactory: {
        createCache(): Map<number, Task<number, string>> {
          return cache;
        },
      },
      schedulerFactory: {
        createScheduler(): MicroTaskBatchScheduler<number, string> {
          return scheduler;
        },
      },
    });
  });

  it('is frozen', () => {
    expect(Object.isFrozen(resolver)).toBe(true);
  });

  it('throws if signal is aborted', async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    controller.abort();
    expect(() => resolver.resolve(context, 1, signal)).toThrowError(DOMException);
  });

  it('resolves a task', async () => {
    await expect(resolver.resolve(context, 3)).resolves.toStrictEqual('aaa');
  });

  it('deduplicates', async () => {
    const task1 = resolver.resolve(context, 1);
    const task2 = resolver.resolve(context, 1);
    await expect(Promise.all([task1, task2])).resolves.toStrictEqual(['a', 'a']);
    expect(onResolve).toHaveBeenCalledTimes(1);
    expect(onResolve).toHaveBeenCalledWith(context, [task1]);
  });

  it('purges a single task', async () => {
    const task1 = resolver.resolve(context, 3);
    await expect(task1).resolves.toStrictEqual('aaa');
    expect(resolver.purge(context, 3)).toBe(true);
    const task2 = resolver.resolve(context, 3);
    await expect(task2).resolves.toStrictEqual('aaa');
    expect(onResolve).toHaveBeenNthCalledWith(1, context, [task1]);
    expect(onResolve).toHaveBeenNthCalledWith(2, context, [task2]);
  });

  it('purges all tasks', async () => {
    const task1 = resolver.resolve(context, 1);
    await expect(task1).resolves.toStrictEqual('a');
    expect(resolver.purge(context)).toBe(true);
    const task2 = resolver.resolve(context, 2);
    await expect(task2).resolves.toStrictEqual('aa');
    expect(onResolve).toHaveBeenNthCalledWith(1, context, [task2]);
  });
});
