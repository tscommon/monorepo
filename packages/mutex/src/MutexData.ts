export class MutexData<T> {
  #value: T;

  public get value(): T {
    return this.#value;
  }

  public set value(value: T) {
    this.#value = value;
  }

  public constructor(value: T) {
    this.#value = value;
    Object.freeze(this);
  }
}
