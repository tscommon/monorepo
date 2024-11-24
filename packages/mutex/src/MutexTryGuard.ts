import { MutextGuard } from './MutexGuard';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export class MutexTryGuard<T> extends MutextGuard<T | undefined> {
  public override then<R>(cb: (value?: T) => PromiseLike<R>): PromiseLike<R> {
    return this.state.queue ? Promise.resolve(undefined).then(cb) : super.then(cb);
  }
}
