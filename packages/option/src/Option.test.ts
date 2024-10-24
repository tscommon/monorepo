import { describe, expect, test } from 'vitest';
import { None, Option, Some } from './Option';

describe('Option', () => {
  test('has some value', () => {
    const option: Option<number> = Option.some(42);
    expect(option).toStrictEqual(Option.some(42));
  });

  test('has none value', () => {
    const option: Option<number> = Option.none;
    expect(option).toBe(Option.none);
  });

  test('is of type some', () => {
    const option = Option.some(42);
    expect(Option.is(option, Some)).toBe(true);
  });

  test('is of type none', () => {
    const option: Option<number> = Option.none;
    expect(Option.is(option, None)).toBe(true);
  });

  test('returns some if every is some', async () => {
    type Tuple = [a: Option<number>, b: Option<string>];
    const tuple: Tuple = [Option.some(42), Option.some('42')];
    expect(Option.all(tuple)).toStrictEqual(Option.some([42, '42']));
  });

  test('returns none if not every is some', () => {
    type Tuple = [a: Option<number>, b: Option<string>];
    const tuple: Tuple = [Option.some(42), Option.none];
    expect(Option.all(tuple)).toBe(Option.none);
  });

  test('returns first some', () => {
    const options: Option<number>[] = [Option.none, Option.some<number>(42)];
    expect(Option.any(options)).toStrictEqual(Option.some<number>(42));
  });

  test('returns none if there is no some', () => {
    const options: Option<number>[] = [Option.none, Option.none];
    expect(Option.any(options)).toBe(Option.none);
  });

  test('unwraps value', () => {
    const option: Option<number> = Option.some(42);
    expect(Option.unwrap(option)).toBe(42);
  });

  test('asserts type', () => {
    const option: Option<number> = Option.none;
    expect(() => Option.assert(option, Some)).toThrowError('Expected Some but got None');
  });

  test('narrows down the type', () => {
    const option: Option<number> = Option.some(42);
    Option.assert(option, Some);
    expect(option.value).toBe(42);
  });

  test('is immutable', () => {
    const option = Option.some(42);
    expect(() => {
      Object.assign(option, {
        value: -1,
      });
    }).toThrowError(TypeError);
  });

  test('implements string tag', () => {
    const option: Option<number> = Option.some(42);
    expect(Object.prototype.toString.call(option)).toBe('[object Some]');
  });

  test('implements string tag', () => {
    const option: Option<number> = Option.none;
    expect(Object.prototype.toString.call(option)).toBe('[object None]');
  });
});
