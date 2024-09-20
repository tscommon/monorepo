import { Option } from "@tscommon/option";
import { MutextGuard } from "./MutexGuard";
import { MutexState } from "./MutexState";
import { MutexTryGuard } from "./MutexTryGuard";

export class Mutex<T> {
  protected readonly state = new MutexState();

  public constructor(private readonly data: T) {
    Object.freeze(this);
  }

  public lock(): MutextGuard<T> {
    return new MutextGuard<T>(this.data, this.state);
  }

  public tryLock(): MutextGuard<Option<T>> {
    return new MutexTryGuard<T>(Option.some(this.data), this.state);
  }
}
