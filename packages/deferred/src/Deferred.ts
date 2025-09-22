/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { DeferredState } from './DeferredState.js';

/**
 * Represents a deferred promise.
 *
 * **Example:**
 * {@includeCode ../examples/index.ts}
 */
export class Deferred<T> implements PromiseLike<T> {
  private _resolve!: (value: T | PromiseLike<T>) => void;
  private _reject!: (reason?: any) => void;
  private _state: DeferredState = DeferredState.Pending;
  private readonly _promise: Promise<T>;
  private readonly _signal?: AbortSignal;
  private readonly _onAbortCallback?: (event: Event) => void;

  public constructor(signal?: AbortSignal) {
    if (signal) {
      signal.throwIfAborted();
      this._signal = signal;
      this._onAbortCallback = this._onAbort.bind(this);
      this._signal.addEventListener('abort', this._onAbortCallback, { once: true, capture: true });
    }
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  /**
   * Gets the current state of the deferred promise.
   * @see {@link DeferredState}
   */
  public get state(): DeferredState {
    return this._state;
  }

  /**
   * Resolves the promise with a value or the result of another promise.
   * @param value The value to resolve the promise with.
   */
  public resolve(value: T | PromiseLike<T>): void {
    if (this._state === DeferredState.Pending) {
      this._state = DeferredState.Fulfilled;
      this._signal?.removeEventListener('abort', this._onAbortCallback!, true);
      this._resolve(value);
    }
  }

  /**
   * Rejects the promise with a reason.
   * @param reason The reason why the promise was rejected.
   */
  public reject(reason?: any): void {
    if (this._state === DeferredState.Pending) {
      this._state = DeferredState.Rejected;
      this._signal?.removeEventListener('abort', this._onAbortCallback!, true);
      this._reject(reason);
    }
  }

  /**
   * @private
   */
  public then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this._promise.then(onfulfilled, onrejected);
  }

  private _onAbort(event: Event): void {
    this.reject((event.target as AbortSignal).reason);
  }
}
