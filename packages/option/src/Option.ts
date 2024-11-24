/**
 * Represents an optional value.
 * An `Option` is either a `Some` value containing a value,
 * or a `None` value containing no value.
 *
 * @example
 *
 * ```typescript
 * let o: Option<number> = Option.some(42);
 * o = Option.none; // Marks the option as empty
 * ```
 */
export abstract class Option<T> {
  /**
   * Returns a `None` value.
   *
   * @example
   *
   * ```typescript
   * let o: Option<number> = Option.none;
   * ```
   */
  public static get none(): Option<never> {
    return None.instance;
  }

  /**
   * Returns a `Some` value.
   *
   * @example
   * ```typescript
   * let o: Option<number> = Option.some(42);
   * ```
   */
  public static some<T>(value: T): Option<T> {
    return Some.from(value);
  }

  /**
   * Returns the array of `Some` values, if all are `Some`.
   *
   * @example
   *
   * ```typescript
   * const tuple = [Option.some(42), Option.some('42')] as const;
   * Option.all(tuple); // Option<[number, string]>
   * ```
   */
  public static all<T extends readonly Option<unknown>[]>(
    values: T,
  ): Option<{ -readonly [K in keyof T]: OptionType<T[K]> }> {
    const result: unknown[] = [];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < values.length; ++i) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const option = values[i]!;
      if (option instanceof None) {
        return this.none;
      }
      result.push(option._value);
    }
    return Option.some(result) as Option<{
      -readonly [K in keyof T]: OptionType<T[K]>;
    }>;
  }

  /**
   * Returns the first `Some` value in the array, if any is `Some`.
   *
   * @example
   *
   * ```typescript
   * const tuple = [Option.none, Option.some(42), Option.some('42')] as const;
   * Option.any(tuple); // Option<number | string>
   * ```
   */
  public static any<T extends readonly Option<unknown>[]>(values: T): Option<OptionType<T[number]>> {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < values.length; ++i) {
      const option = values[i];
      if (option instanceof Some) {
        return option as Option<OptionType<T[number]>>;
      }
    }
    return this.none;
  }

  protected readonly _value: T;

  protected constructor(value: T) {
    this._value = value;
  }

  /**
   * Returns `true` if the option is a `Some` value.
   */
  public static is<T>(option: Option<T>, type: typeof Some): option is Some<T>;
  /**
   * Returns `true` if the option is a `None` value.
   */
  public static is<T>(option: Option<T>, type: typeof None): option is None;
  public static is<T>(option: Option<T>, type: typeof None | typeof Some = Some): option is Option<T> {
    return option instanceof type;
  }

  /**
   * Asserts that the option is a `Some` value.
   * @throws If the value is a `None`.
   */
  public static assert<T>(option: Option<T>, type: typeof Some): asserts option is Some<T>;
  /**
   * Asserts that the option is a `None` value.
   * @throws If the value is a `Some`.
   */
  public static assert<T>(option: Option<T>, type: typeof None): asserts option is None;
  public static assert<T>(option: Option<T>, type: typeof None | typeof Some = Some): asserts option is Option<T> {
    if (!(option instanceof type)) {
      throw new TypeError(`Expected ${type.name} but got ${option.constructor.name}`);
    }
  }

  /**
   * Unwraps the option, yielding the content of a `Some`.
   * @throws If the value is a `None`.
   */
  public static unwrap<T>(option: Option<T>): T {
    Option.assert<T>(option, Some);
    return option._value;
  }
}

export class Some<T> extends Option<T> {
  /**
   * Returns a `Some` value.
   *
   * Prefer using {@link Option.some|`Option.some`} instead.
   */
  public static from<T>(value: T): Some<T> {
    return new Some<T>(value);
  }

  protected constructor(value: T) {
    super(value);
    if (new.target === Some) {
      Object.freeze(this);
    }
  }

  public get value(): T {
    return this._value;
  }

  public readonly [Symbol.toStringTag] = 'Some';
}

export class None extends Option<never> {
  /**
   * The singleton instance of `None`.
   *
   * Prefer using {@link Option.none|`Option.none`} instead.
   */
  public static readonly instance = new None();

  protected constructor() {
    super(undefined as never);
    if (new.target === None) {
      Object.freeze(this);
    }
  }

  public readonly [Symbol.toStringTag] = 'None';
}

/**
 * Returns the type of the value of the option.
 *
 * @example
 *
 * ```typescript
 * type T0 = OptionType<Option<number>>; // number
 * type T1 = OptionType<Option<string>>; // string
 * type T2 = OptionType<None>; // never
 * ```
 */
export type OptionType<T> = T extends Option<infer U> ? U : T;
