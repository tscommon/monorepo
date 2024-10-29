import type { BatchScheduler } from './BatchScheduler';

export interface BatchSchedulerFactory<Payload, Result> {
  createScheduler(signal?: AbortSignal): BatchScheduler<Payload, Result>;
}
