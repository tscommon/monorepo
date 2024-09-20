import { describe, expect, test } from "vitest";
import { Box } from "./Box";

describe("Box", () => {
  test("contains value", () => {
    const box = new Box(42);
    expect(box.value).toBe(42);
  });

  test("cannot change properties", () => {
    const box = new Box<undefined>(undefined);
    expect(() => delete box.value).toThrow(/Cannot delete property/);
  });

  test("implements Symbol.toStringTag", () => {
    expect(new Box(42).toString()).toBe("[object Box]");
  });
});
