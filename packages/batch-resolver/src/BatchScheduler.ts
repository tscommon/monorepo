import type { Task } from './Task';

export interface BatchScheduler<Payload, Result> {
  schedule(task: Task<Payload, Result>): void;
  onSchedule(callback: (tasks: readonly Task<Payload, Result>[]) => void | Promise<void>): void;
}
