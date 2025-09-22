import type { MutexState } from './MutexState.js';

/**
 * An acquired lock on a mutex, providing access to the protected data.
 */
export class MutexGuard<T> implements PromiseLike<T>, AsyncDisposable {
  /**
   * @ignore
   */
  protected readonly _state: MutexState;
  private readonly _data: T;
  private readonly _promise: Promise<void>;
  private _resolve!: (value: void | PromiseLike<void>) => void;

  public constructor(state: MutexState, data: T) {
    this._state = state;
    this._data = data;
    this._promise = new Promise<void>((resolve) => (this._resolve = resolve));
  }

  /**
   * **Example:**
   *
   * {@includeCode ../examples/manual.ts}
   */
  public release(): void {
    if (this === this._state.owner) {
      this._state.owner = undefined;
      this._state.queue = undefined;
    }
    this._resolve();
  }

  /**
   * @ignore
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  public async [Symbol.asyncDispose](): Promise<void> {
    this.release();
  }

  /**
   * @ignore
   */
  public then<R>(cb: (value: T) => PromiseLike<R>): PromiseLike<R> {
    const lock = Promise.resolve(this._state.queue).then(() => cb(this._data));
    this._state.owner = this;
    this._state.queue = lock.then(() => this._promise);
    return lock;
  }
}
