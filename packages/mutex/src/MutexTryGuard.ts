import { MutextGuard } from './MutexGuard';

export class MutexTryGuard<T> extends MutextGuard<T | undefined> {
  public override then<R>(cb: (value?: T) => PromiseLike<R>): PromiseLike<R> {
    return this.state.queue ? Promise.resolve(undefined).then(cb) : super.then(cb);
  }
}
