/**
 * Error indicating that a task was not resolved by the batch resolver.
 */
export class TaskUnresolvedError extends Error {
  public constructor() {
    super('The batch resolver has not settled this task');
  }
}
