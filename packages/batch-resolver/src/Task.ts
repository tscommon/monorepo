import { Deferred } from '@tscommon/deferred';

export class Task<Payload, Result> extends Deferred<Result> {
  #shares = 0;
  readonly #controller = new AbortController();
  readonly #payload: Payload;

  public constructor(payload: Payload) {
    super();
    this.#payload = payload;
    Object.freeze(this);
  }

  public get payload(): Payload {
    return this.#payload;
  }

  public get signal(): AbortSignal {
    return this.#controller.signal;
  }

  public share(signal?: AbortSignal): Promise<Result> {
    this.#shares++;
    return signal ? Promise.race([this, this.#onAbort(signal)]) : this;
  }

  #onAbort(signal: AbortSignal): Promise<never> {
    return new Promise<never>((_, reject) => {
      signal.addEventListener(
        'abort',
        () => {
          if (this.#shares > 0 && --this.#shares === 0) {
            this.#controller.abort(signal.reason);
          }
          reject(signal.reason);
        },
        { once: true },
      );
    });
  }
}
