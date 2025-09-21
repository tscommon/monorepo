import { MutexData } from './MutexData.js';
import { MutexGuard } from './MutexGuard.js';
import { MutexState } from './MutexState.js';
import { MutexTryGuard } from './MutexTryGuard.js';

/**
 * A mutual exclusion lock (mutex) for synchronizing access to shared data.
 *
 * {@includeCode ../examples/demo.ts}
 */
export class Mutex<T> {
  private readonly _state: MutexState;
  private readonly _data: MutexData<T>;

  public constructor(data: T) {
    this._state = new MutexState();
    this._data = new MutexData<T>(data);
  }

  /**
   * Acquires the mutex, returning a guard that will release the lock when disposed.
   *
   * {@includeCode ../examples/auto.ts}
   */
  public lock(): MutexGuard<MutexData<T>> {
    return new MutexGuard<MutexData<T>>(this._state, this._data);
  }

  /**
   * Attempts to acquire the mutex without waiting. If the lock is not available, returns a guard with `undefined` data.
   *
   * {@includeCode ../examples/try.ts}
   */
  public tryLock(): MutexGuard<MutexData<T> | undefined> {
    return new MutexTryGuard<MutexData<T> | undefined>(this._state, this._data);
  }
}
