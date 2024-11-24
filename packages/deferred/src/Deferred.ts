/* eslint-disable @typescript-eslint/no-explicit-any */

import { DeferredState } from './DeferredState';

/**
 * Represents a deferred promise.
 */
export class Deferred<T> implements Promise<T> {
  #resolve!: (value: T | PromiseLike<T>) => void;
  #reject!: (reason?: any) => void;
  #promise: Promise<T>;
  #state: DeferredState = DeferredState.Pending;

  public constructor() {
    this.#promise = new Promise<T>((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
    if (new.target === Deferred) {
      Object.freeze(this);
    }
  }

  /**
   * Gets the current state of the deferred promise.
   * @see {@link DeferredState}
   */
  public get state(): DeferredState {
    return this.#state;
  }

  /**
   * Resolves the promise with a value or the result of another promise.
   * @param value The value to resolve the promise with.
   */
  public resolve(value: T | PromiseLike<T>): void {
    if (this.#state === DeferredState.Pending) {
      this.#state = DeferredState.Fulfilled;
      this.#resolve(value);
    }
  }

  /**
   * Rejects the promise with a reason.
   * @param reason The reason why the promise was rejected.
   */
  public reject(reason?: any): void {
    if (this.#state === DeferredState.Pending) {
      this.#state = DeferredState.Rejected;
      this.#reject(reason);
    }
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the promise.
   * @param onfulfilled The callback to execute when the promise is resolved.
   * @param onrejected The callback to execute when the promise is rejected.
   */
  public then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.#promise.then(onfulfilled, onrejected);
  }

  /**
   * Attaches a callback for only the rejection of the promise.
   */
  public catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ): Promise<T | TResult> {
    return this.#promise.catch(onrejected);
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   */
  public finally(onfinally?: (() => void) | null): Promise<T> {
    return this.#promise.finally(onfinally);
  }

  /**
   * Returns a string representation of the object.
   */
  public readonly [Symbol.toStringTag] = 'Deferred';
}
