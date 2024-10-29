import { describe, expect, it, vi } from 'vitest';
import { MicroTaskBatchScheduler } from './MicroTaskBatchScheduler';
import { Task } from './Task';

vi.mock('./Task', () => ({
  Task: vi.fn(),
}));

function waitNextMicroTask(): Promise<void> {
  return new Promise<void>((resolve) => {
    queueMicrotask(resolve);
  });
}

describe('MicroTaskBatchScheduler', () => {
  it('schedules tasks', async () => {
    const controller = new AbortController();
    const scheduler = new MicroTaskBatchScheduler<number, string>(controller.signal);
    const task = new Task<number, string>(42);
    scheduler.schedule(task);
    scheduler.schedule(task);
    scheduler.schedule(task);
    const onSchedule = vi.fn();
    scheduler.onSchedule(onSchedule);
    await waitNextMicroTask();
    expect(onSchedule).toHaveBeenCalledWith([task, task, task]);
    expect(onSchedule).toHaveBeenCalledTimes(1);
  });
});
