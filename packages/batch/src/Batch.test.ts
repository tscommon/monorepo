import { Readable } from 'stream';
import { describe, expect, it } from 'vitest';
import { Batch } from './Batch';
import { BatchItem } from './BatchItem';

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function isEven(value: number): boolean {
  return value % 2 === 0;
}

describe('Batch', () => {
  describe('from', () => {
    it('should return batches of items', () => {
      expect(Array.from(Batch.from(items, 3))).toStrictEqual([
        new Batch(0, [1, 2, 3]),
        new Batch(1, [4, 5, 6]),
        new Batch(2, [7, 8, 9]),
        new Batch(3, [10]),
      ]);
    });

    it('should return batches of even numbers', () => {
      expect(Array.from(Batch.from(items, 3, isEven))).toStrictEqual([new Batch(0, [2, 4, 6]), new Batch(1, [8, 10])]);
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
        new Batch(0, [1, 2, 3]),
        new Batch(1, [4, 5, 6]),
        new Batch(2, [7, 8, 9]),
        new Batch(3, [10]),
      ]);
    });

    it('should return batches of even numbers', async () => {
      await expect(Array.fromAsync(Batch.fromAsync(Readable.from(items), 3, isEven))).resolves.toStrictEqual([
        new Batch(0, [2, 4, 6]),
        new Batch(1, [8, 10]),
      ]);
    });

    it('throws on invalid size', async () => {
      await expect(Array.fromAsync(Batch.fromAsync(items, 0))).rejects.toThrow(RangeError);
    });
  });

  it('is iterable', () => {
    expect(Array.from(new Batch(0, [1, 2, 3]))).toStrictEqual([
      new BatchItem(0, 1),
      new BatchItem(1, 2),
      new BatchItem(2, 3),
    ]);
  });
});
