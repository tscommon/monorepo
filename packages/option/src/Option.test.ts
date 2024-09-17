import { describe, expect, test } from "vitest";
import { Option } from "./Option";
import { OptionError } from "./OptionError";

describe("Option", () => {
  test("stores some value", () => {
    const option = Option.some(42);
    expect(option.unwrap()).toBe(42);
  });

  test("stores no value", () => {
    const option: Option<number> = Option.none;
    expect(() => option.unwrap()).toThrowError(new OptionError("Empty value"));
  });

  test("resolves tuple value", async () => {
    type Tuple = [a: Option<number>, b: Option<string>];
    const tuple: Tuple = [Option.some(42), Option.some("42")];
    expect(Option.all(tuple)).toStrictEqual([42, "42"]);
  });

  test("throws if tuple value is empty", () => {
    type Tuple = [a: Option<number>, b: Option<string>];
    const tuple: Tuple = [Option.some(42), Option.none];
    expect(() => Option.all(tuple)).toThrowError(
      new OptionError("Empty value"),
    );
  });

  test("resolves first value", () => {
    const options = [Option.none, Option.some(42)];
    expect(Option.any(options)).toBe(42);
  });

  test("throws if any value is empty", () => {
    const options = [Option.none, Option.none];
    expect(() => Option.any(options)).toThrowError(
      new OptionError("Empty value"),
    );
  });

  test("is immutable", () => {
    const option = Option.some(42);
    expect(() => Object.assign(option, { value: -1 })).toThrowError(TypeError);
  });
});
