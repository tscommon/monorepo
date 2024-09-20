import { Option } from "@tscommon/option";
import { MutextGuard } from "./MutexGuard";

export class MutexTryGuard<T> extends MutextGuard<Option<T>> {
  public override then<TResult1 = Option<T>>(
    onfulfilled?:
      | ((value: Option<T>) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
  ): PromiseLike<TResult1> {
    if (this.state.lock) {
      return Promise.resolve(Option.none).then(onfulfilled);
    }
    return super.then(onfulfilled);
  }
}
