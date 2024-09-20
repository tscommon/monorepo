/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface DeferFunction {
  <U extends any[], T extends (...args: U) => any>(fn: T, ...args: U): T;
}

export class DeferFunction
  extends Function
  implements Disposable, AsyncDisposable
{
  protected static readonly handler: ProxyHandler<DeferFunction> = {
    apply: (target, _, args) => {
      target.stack.push(args);
    },
  };

  protected readonly stack: any[] = [];

  public constructor() {
    super();
    Object.freeze(this);
    return new Proxy(this, DeferFunction.handler);
  }

  /**
   * @internal
   */
  public [Symbol.dispose]() {
    for (let i = this.stack.length - 1; i >= 0; --i) {
      const [fn, ...args] = this.stack[i]!;
      fn.call(null, ...args);
    }
  }

  /**
   * @internal
   */
  public async [Symbol.asyncDispose]() {
    for (let i = this.stack.length - 1; i >= 0; --i) {
      const [fn, ...args] = this.stack[i]!;
      await fn.call(null, ...args);
    }
  }
}
