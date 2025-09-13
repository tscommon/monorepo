import { Deferred } from '@tscommon/deferred';

export class Task<I, O> extends Deferred<O> {
  readonly #input!: I;

  public get input(): I {
    return this.#input;
  }

  public constructor(input: I) {
    super();
    this.#input = input;
    if (new.target === Task) {
      Object.freeze(this);
    }
  }

  public override get [Symbol.toStringTag](): string {
    return 'Task';
  }
}
