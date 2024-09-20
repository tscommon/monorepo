/* eslint-disable @typescript-eslint/no-explicit-any */

export function synchronized<T extends (...args: any) => Promise<any>>(
  _target: object,
  _propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> | void {
  const { value: method } = descriptor;

  let ref: WeakRef<Promise<any>> | undefined;

  function __synchronizer(this: object, ...args: any) {
    const next = () => method!.apply(this, args);
    const promise = Promise.resolve(ref?.deref()).then(next, next);
    ref = new WeakRef(promise);
    return promise;
  }

  descriptor.value = __synchronizer as T;
}
