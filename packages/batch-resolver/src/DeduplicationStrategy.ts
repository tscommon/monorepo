/**
 * Strategy for handling duplicate tasks with the same key.
 */
export enum DeduplicationStrategy {
  /**
   * Merge duplicate tasks into one. All callers will receive the same result.
   */
  Merge = 0,
  /**
   * Cancel the previous task and create a new one.
   */
  Cancel = 1,
  /**
   * Retry the previously failed task.
   */
  Retry = 2,
}
