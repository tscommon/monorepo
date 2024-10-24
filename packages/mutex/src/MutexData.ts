export class MutexData<T> {
  public constructor(public value: T) {
    Object.seal(this);
  }
}
