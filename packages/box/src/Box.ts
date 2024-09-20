export class Box<T> {
  constructor(public value: T) {
    Object.seal(this);
  }

  protected get [Symbol.toStringTag]() {
    return Box.name;
  }
}
