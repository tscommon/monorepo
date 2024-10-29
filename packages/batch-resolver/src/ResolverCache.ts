import type { Task } from './Task';

export interface ResolverCache<Payload, Result> {
  get(payload: Payload): Task<Payload, Result> | undefined;
  set(payload: Payload, task: Task<Payload, Result>): ResolverCache<Payload, Result>;
  delete(payload: Payload): boolean;
}
