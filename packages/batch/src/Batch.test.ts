import { Readable } from "stream";
import { describe, expect, test } from "vitest";
import { Batch } from "./Batch";
import { BatchItem } from "./BatchItem";

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe("Batch", () => {
  describe("from", () => {
    test("should return batches of items", () => {
      const batches = Array.from(Batch.from(items, 3));
      expect(batches).toStrictEqual([
        new Batch(0, [1, 2, 3]),
        new Batch(1, [4, 5, 6]),
        new Batch(2, [7, 8, 9]),
        new Batch(3, [10]),
      ]);
    });

    test("throws on invalid size", () => {
      expect(() => Array.from(Batch.from(items, 0))).toThrow(RangeError);
    });
  });

  describe("fromAsync", () => {
    test("should return batches of items", async () => {
      await expect(
        Array.fromAsync(Batch.fromAsync(Readable.from(items), 3)),
      ).resolves.toStrictEqual([
        new Batch(0, [1, 2, 3]),
        new Batch(1, [4, 5, 6]),
        new Batch(2, [7, 8, 9]),
        new Batch(3, [10]),
      ]);
    });

    test("throws on invalid size", async () => {
      const iterator = Array.fromAsync(Batch.fromAsync(items, 0));
      await expect(iterator).rejects.toThrow(RangeError);
    });
  });

  test("acts as an iterable", () => {
    const batches = Array.from(new Batch(0, [1, 2, 3]));
    expect(batches).toStrictEqual([
      new BatchItem(0, 0, 1),
      new BatchItem(0, 1, 2),
      new BatchItem(0, 2, 3),
    ]);
  });
});
