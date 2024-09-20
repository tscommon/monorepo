/* eslint-disable @typescript-eslint/no-explicit-any */

export class Deferred<T> implements PromiseLike<T> {
  protected readonly _resolve!: (value: T) => void;

  protected readonly _reject!: (reason: any) => void;

  protected readonly _promise: Promise<T>;

  public constructor() {
    this._promise = new Promise<T>((_resolve, _reject) =>
      Object.assign(this, {
        _resolve,
        _reject,
      }),
    );
    Object.freeze(this);
  }

  public resolve(value: T): void {
    this._resolve(value);
  }

  public reject(reason: any): void {
    this._reject(reason);
  }

  /**
   * @internal
   */
  public then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): PromiseLike<TResult1 | TResult2> {
    return this._promise.then(onfulfilled, onrejected);
  }
}
