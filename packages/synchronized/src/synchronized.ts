/* eslint-disable @typescript-eslint/no-explicit-any */

export function synchronized<T extends (...args: any) => Promise<unknown>>(
  _target: object,
  _propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> | void {
  const { value: method } = descriptor;

  const locks = new WeakMap<object, Promise<unknown>>();

  function __synchronizer(this: object, ...args: any) {
    const next = () => method!.apply(this, args);
    const promise = Promise.resolve(locks.get(this)).then(next, next);
    locks.set(this, promise);
    return promise;
  }

  descriptor.value = __synchronizer as T;
}
