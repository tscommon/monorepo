import { BatchItem } from "./BatchItem";

export class Batch<T> implements Iterable<BatchItem<T>> {
  public static *from<T>(
    iterable: Iterable<T>,
    size: number,
  ): Iterable<Batch<T>> {
    if (size < 1) {
      throw new RangeError("The size must be greater than or equal to 1.");
    }
    let index = 0;
    let items: T[] = [];
    for (const item of iterable) {
      items.push(item);
      if (items.length === size) {
        yield new Batch(index++, items);
        items = [];
      }
    }
    if (items.length > 0) {
      yield new Batch(index++, items);
    }
  }

  public static async *fromAsync<T>(
    iterable: Iterable<T> | AsyncIterable<T>,
    size: number,
  ): AsyncIterable<Batch<T>> {
    if (size < 1) {
      throw new RangeError("The size must be greater than or equal to 1.");
    }
    let index = 0;
    let items: T[] = [];
    for await (const item of iterable) {
      items.push(item);
      if (items.length === size) {
        yield new Batch(index++, items);
        items = [];
      }
    }
    if (items.length > 0) {
      yield new Batch(index++, items);
    }
  }

  public constructor(
    public readonly index: number,
    public readonly items: readonly T[],
  ) {
    Object.freeze(this);
  }

  public *[Symbol.iterator](): Iterator<BatchItem<T>> {
    for (let index = 0; index < this.items.length; index++) {
      yield new BatchItem(this.index, index, this.items[index]!);
    }
  }
}
