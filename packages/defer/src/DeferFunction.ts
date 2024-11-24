/* eslint-disable @typescript-eslint/no-unsafe-function-type */

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface DeferFunction {
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
  <U extends unknown[], T extends (...args: U) => unknown>(fn: T, ...args: U): T;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class DeferFunction extends Function implements Disposable, AsyncDisposable {
  protected static readonly handler: ProxyHandler<DeferFunction> = {
    apply: (target, _, args: [Function, unknown[]]) => {
      target.stack.push(args);
    },
  };

  protected readonly stack: [Function, unknown[]][] = [];

  public constructor() {
    super();
    Object.freeze(this);
    return new Proxy(this, DeferFunction.handler);
  }

  /**
   * @internal
   */
  public [Symbol.dispose](): void {
    for (let i = this.stack.length - 1; i >= 0; --i) {
      const [fn, ...args] = this.stack[i]!;
      fn.call(null, ...args);
    }
  }

  /**
   * @internal
   */
  public async [Symbol.asyncDispose](): Promise<void> {
    for (let i = this.stack.length - 1; i >= 0; --i) {
      const [fn, ...args] = this.stack[i]!;
      await fn.call(null, ...args);
    }
  }
}
