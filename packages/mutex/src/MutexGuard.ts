import type { MutexState } from "./MutexState";

export class MutextGuard<T> implements PromiseLike<T>, AsyncDisposable {
  protected readonly promise: Promise<void>;

  protected readonly resolve!: (value: void | PromiseLike<void>) => void;

  public constructor(
    protected readonly resource: T,
    protected readonly state: MutexState,
  ) {
    this.promise = new Promise<void>((resolve) =>
      Object.assign(this, {
        resolve,
      }),
    );
    Object.freeze(this);
  }

  public release(): void {
    if (this === this.state.owner) {
      this.state.owner = undefined;
      this.state.lock = undefined;
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
  public then<TResult1 = T>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
  ): PromiseLike<TResult1> {
    const prev = Promise.resolve(this.state.lock);
    const current = prev.then(() => this.resource).then(onfulfilled);
    this.state.owner = this;
    this.state.lock = current.then(() => this.promise);
    return current as PromiseLike<TResult1>;
  }
}
