import { MutexData } from './MutexData';
import { MutextGuard } from './MutexGuard';
import { MutexState } from './MutexState';
import { MutexTryGuard } from './MutexTryGuard';

export class Mutex<T> {
  private readonly state = new MutexState();
  private readonly data: MutexData<T>;

  public constructor(data: T) {
    this.data = new MutexData<T>(data);
    Object.freeze(this);
  }

  public lock(): MutextGuard<MutexData<T>> {
    return new MutextGuard<MutexData<T>>(this.state, this.data);
  }

  public tryLock(): MutextGuard<MutexData<T> | undefined> {
    return new MutexTryGuard<MutexData<T> | undefined>(this.state, this.data);
  }
}
