/**
 * A generic container that holds a value of type `T`.
 *
 * **Example:**
 * {@includeCode ../examples/index.ts}
 */
export class Box<T> {
  public constructor(public value: T) {}
}
