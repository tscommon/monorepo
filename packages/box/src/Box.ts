export class Box<T> {
  public constructor(public value: T) {
    Object.seal(this);
  }
}
