/**
 * A generic container that holds a value of type `T`.
 *
 * {@includeCode ../examples/index.ts}
 */
export class Box<T> {
  public constructor(public value: T) {}
}
