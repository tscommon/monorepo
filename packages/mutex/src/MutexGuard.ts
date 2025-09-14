import type { MutexState } from './MutexState';

export class MutexGuard<T> implements PromiseLike<T>, AsyncDisposable {
  readonly #state: MutexState;
  readonly #data: T;
  readonly #promise: Promise<void>;
  #resolve!: (value: void | PromiseLike<void>) => void;

  protected get isLocked(): boolean {
    return this.#state.owner !== undefined;
  }

  public constructor(state: MutexState, data: T) {
    this.#state = state;
    this.#data = data;
    this.#promise = new Promise<void>((resolve) => (this.#resolve = resolve));
    Object.freeze(this);
  }

  public release(): void {
    if (this === this.#state.owner) {
      this.#state.owner = undefined;
      this.#state.queue = undefined;
    }
    this.#resolve();
  }

  /**
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  public async [Symbol.asyncDispose](): Promise<void> {
    this.release();
  }

  /**
   * @internal
   */
  public then<R>(cb: (value: T) => PromiseLike<R>): PromiseLike<R> {
    const lock = Promise.resolve(this.#state.queue).then(() => cb(this.#data));
    this.#state.owner = this;
    this.#state.queue = lock.then(() => this.#promise);
    return lock;
  }
}
