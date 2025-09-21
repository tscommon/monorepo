/**
 * Represents the state of a deferred promise.
 */
export enum DeferredState {
  /**
   * The promise is still pending.
   */
  Pending,
  /**
   * The promise has been fulfilled.
   */
  Fulfilled,
  /**
   * The promise has been rejected.
   */
  Rejected,
}
