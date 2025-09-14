import { MutexData } from './MutexData';
import { MutexGuard } from './MutexGuard';
import { MutexState } from './MutexState';
import { MutexTryGuard } from './MutexTryGuard';

export class Mutex<T> {
  readonly #state: MutexState;
  readonly #data: MutexData<T>;

  public constructor(data: T) {
    this.#state = new MutexState();
    this.#data = new MutexData<T>(data);
    Object.freeze(this);
  }

  public lock(): MutexGuard<MutexData<T>> {
    return new MutexGuard<MutexData<T>>(this.#state, this.#data);
  }

  public tryLock(): MutexGuard<MutexData<T> | undefined> {
    return new MutexTryGuard<MutexData<T> | undefined>(this.#state, this.#data);
  }
}
