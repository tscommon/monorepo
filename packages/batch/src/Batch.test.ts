import { Readable } from 'stream';
import { describe, expect, it } from 'vitest';
import { Batch } from './Batch.js';
import { BatchItem } from './BatchItem.js';

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function isEven(value: number): boolean {
  return value % 2 === 0;
}

describe('Batch', () => {
  describe('from', () => {
    it('should return batches of items', () => {
      expect(Array.from(Batch.from(items, 3))).toStrictEqual([
        new Batch([1, 2, 3], 0),
        new Batch([4, 5, 6], 1),
        new Batch([7, 8, 9], 2),
        new Batch([10], 3),
      ]);
    });

    it('should return batches of even numbers', () => {
      expect(Array.from(Batch.from(items, 3, isEven))).toStrictEqual([new Batch([2, 4, 6], 0), new Batch([8, 10], 1)]);
    });

    it('throws on invalid size', () => {
      expect(() => Array.from(Batch.from(items, 0))).toThrow(RangeError);
    });

    it('supports iterator', () => {
      expect(Array.from(Iterator.from(Batch.from(items, 3)).map((batch) => batch.length))).toStrictEqual([3, 3, 3, 1]);
    });
  });

  describe('fromAsync', () => {
    it('should return batches of items', async () => {
      await expect(Array.fromAsync(Batch.fromAsync(Readable.from(items), 3))).resolves.toStrictEqual([
        new Batch([1, 2, 3], 0),
        new Batch([4, 5, 6], 1),
        new Batch([7, 8, 9], 2),
        new Batch([10], 3),
      ]);
    });

    it('should return batches of even numbers', async () => {
      await expect(Array.fromAsync(Batch.fromAsync(Readable.from(items), 3, isEven))).resolves.toStrictEqual([
        new Batch([2, 4, 6], 0),
        new Batch([8, 10], 1),
      ]);
    });

    it('throws on invalid size', async () => {
      await expect(Array.fromAsync(Batch.fromAsync(items, 0))).rejects.toThrow(RangeError);
    });
  });

  it('is iterable', () => {
    expect(Array.from(new Batch([1, 2, 3], 0))).toStrictEqual([
      new BatchItem(0, 1),
      new BatchItem(1, 2),
      new BatchItem(2, 3),
    ]);
  });
});
