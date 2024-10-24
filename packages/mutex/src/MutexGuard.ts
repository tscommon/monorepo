import type { MutexState } from './MutexState';

export class MutextGuard<T> implements PromiseLike<T>, AsyncDisposable {
  private readonly promise: Promise<void>;
  private resolve!: (value: void | PromiseLike<void>) => void;

  public constructor(
    protected readonly state: MutexState,
    private readonly data: T,
  ) {
    this.promise = new Promise<void>((resolve) => (this.resolve = resolve));
    Object.freeze(this);
  }

  public release(): void {
    if (this === this.state.owner) {
      this.state.owner = undefined;
      this.state.queue = undefined;
    }
    this.resolve();
  }

  /**
   * @internal
   */
  public async [Symbol.asyncDispose](): Promise<void> {
    this.release();
  }

  /**
   * @internal
   */
  public then<R>(cb: (value: T) => PromiseLike<R>): PromiseLike<R> {
    const lock = Promise.resolve(this.state.queue).then(() => cb(this.data));
    this.state.owner = this;
    this.state.queue = lock.then(() => this.promise);
    return lock as PromiseLike<R>;
  }
}
