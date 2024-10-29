import { describe, expect, it, vi } from 'vitest';
import { BatchExecutor } from './BatchExecutor';
import type { BatchScheduler } from './BatchScheduler';
import type { ResolverCache } from './ResolverCache';

const controller = new AbortController();

vi.mock('./Task', () => ({
  Task: vi.fn((input) => ({
    share: vi.fn(async () => String(input)),
    signal: controller.signal,
  })),
}));

const scheduler: BatchScheduler<number, string> = {
  schedule: vi.fn(),
  onSchedule: vi.fn(),
};

const cache: ResolverCache<number, string> = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

const executor = new BatchExecutor(cache, scheduler);

describe('BatchExecutor', () => {
  it('resolves task', async () => {
    await expect(executor.execute(42)).resolves.toBe('42');
  });

  it('deletes cached task on abort', () => {
    executor.execute(42, controller.signal);
    controller.abort();
    expect(cache.delete).toHaveBeenCalledWith(42);
  });

  it('purges cached task', () => {
    executor.purge(42);
    expect(cache.delete).toHaveBeenCalledWith(42);
  });
});
