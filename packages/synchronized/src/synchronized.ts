/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Synchronize method calls on the same object.
 */
export function synchronized<T extends (...args: any) => Promise<any>>(
  _target: object,
  _propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> {
  const queue = new WeakMap<object, Promise<unknown>>();
  if (typeof descriptor.value === 'function') {
    const { value: method } = descriptor;
    descriptor.value = function synchronized(this: object, ...args: unknown[]) {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const next = () => method.apply(this, args);
      const promise = Promise.resolve(queue.get(this)).then(next, next);
      queue.set(this, promise);
      return promise;
    } as T;
  }
  return descriptor;
}
