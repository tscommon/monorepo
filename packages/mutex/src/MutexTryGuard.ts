import { MutexGuard } from './MutexGuard.js';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export class MutexTryGuard<T> extends MutexGuard<T | undefined> {
  public override then<R>(cb: (value?: T) => PromiseLike<R>): PromiseLike<R> {
    return this._state.owner ? cb(undefined) : super.then(cb);
  }
}
