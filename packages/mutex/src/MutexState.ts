export class MutexState {
  #owner?: object;
  #queue?: Promise<unknown>;

  public get owner(): object | undefined {
    return this.#owner;
  }

  public set owner(value: object | undefined) {
    this.#owner = value;
  }

  public get queue(): Promise<unknown> | undefined {
    return this.#queue;
  }

  public set queue(value: Promise<unknown> | undefined) {
    this.#queue = value;
  }

  public constructor(owner?: object, queue?: Promise<unknown>) {
    this.#owner = owner;
    this.#queue = queue;
    Object.freeze(this);
  }
}
