/**
 * Error indicating that a task was cancelled.
 */
export class TaskCancelledError extends Error {
  public constructor() {
    super('Task cancelled');
  }
}
