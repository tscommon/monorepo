import { OptionError } from "./OptionError";
import type { OptionType } from "./OptionType";

export class Option<T> {
  public static readonly none = new Option<never>(undefined as never);

  public static some<T>(value: T): Option<T> {
    return new Option<T>(value);
  }

  public static all<T extends Option<unknown>[] | []>(options: T) {
    return options.map((option) => option.unwrap()) as {
      -readonly [P in keyof T]: OptionType<T[P]>;
    };
  }

  public static any<T extends Option<unknown>[] | []>(options: T) {
    for (let i = 0; i < options.length; i++) {
      const option = options[i]!;
      if (option === Option.none) {
        continue;
      }
      return option.unwrap() as OptionType<T[number]>;
    }
    throw new OptionError("Empty value");
  }

  protected constructor(protected readonly value: T) {
    Object.freeze(this);
  }

  public unwrap() {
    if ((this as Option<unknown>) === Option.none) {
      throw new OptionError("Empty value");
    }
    return this.value;
  }
}
