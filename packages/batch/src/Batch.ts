/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { BatchItem } from './BatchItem.js';

/**
 * Represents a batch of items.
 *
 * `for of`
 * {@includeCode ../examples/01_for-of.ts}
 *
 * `for await of`
 * {@includeCode ../examples/02_for-await-of.ts}
 *
 * **Predicate:**
 * {@includeCode ../examples/03_predicate.ts}
 *
 * **Chaining:**
 * {@includeCode ../examples/04_chaining.ts}
 */
export class Batch<T> implements Iterable<BatchItem<T>> {
  public static *from<T>(
    iterable: Iterable<T>,
    size: number,
    predicate?: (value: T, index: number) => boolean,
  ): Generator<Batch<T>, undefined> {
    if (size <= 0) {
      throw new RangeError('The size must be greater than 0');
    }
    let index = 0;
    let items: T[] = [];
    for (const item of iterable) {
      if (predicate) {
        if (predicate(item, index)) {
          items.push(item);
        }
      } else {
        items.push(item);
      }
      if (items.length === size) {
        yield new Batch(items, index++);
        items = [];
      }
    }
    if (items.length > 0) {
      yield new Batch(items, index++);
    }
  }

  public static async *fromAsync<T>(
    iterable: Iterable<T> | AsyncIterable<T>,
    size: number,
    predicate?: (value: T, index: number) => boolean,
  ): AsyncGenerator<Batch<T>, undefined> {
    if (size <= 0) {
      throw new RangeError('The size must be greater than 0');
    }
    let index = 0;
    let items: T[] = [];
    for await (const item of iterable) {
      if (predicate) {
        if (predicate(item, index)) {
          items.push(item);
        }
      } else {
        items.push(item);
      }
      if (items.length === size) {
        yield new Batch(items, index++);
        items = [];
      }
    }
    if (items.length > 0) {
      yield new Batch(items, index++);
    }
  }

  public get length(): number {
    return this.items.length;
  }

  public constructor(
    public readonly items: readonly T[],
    public readonly index: number | undefined,
  ) {}

  /**
   * @private
   */
  public [Symbol.iterator](): Iterator<BatchItem<T>> {
    let index = 0;
    const { items } = this;
    return {
      next(): IteratorResult<BatchItem<T>> {
        if (index < items.length) {
          return {
            done: false,
            value: new BatchItem(index, items[index++]!),
          };
        }
        return {
          done: true,
          value: undefined!,
        };
      },
    };
  }
}
