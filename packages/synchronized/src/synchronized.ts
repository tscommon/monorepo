/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

const scopes = new WeakMap<object, WeakMap<Function, Promise<unknown>>>();

/**
 * Synchronize method calls on the same object.
 *
 *
 * ```jsonc
 * // tsconfig.json
 * {
 *   "compilerOptions": {
 *     "experimentalDecorators": true
 *   }
 * }
 * ```
 *
 * {@includeCode ../examples/index.ts}
 */
export function synchronized<T extends (...args: any) => Promise<any>>(
  _target: object,
  _propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> {
  if (typeof descriptor.value === 'function') {
    const { value: method } = descriptor;
    descriptor.value = function synchronized(this: object, ...args: unknown[]) {
      let methods = scopes.get(this);
      if (!methods) {
        methods = new WeakMap<Function, Promise<unknown>>();
        scopes.set(this, methods);
      }
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const next = () => method.apply(this, args);
      const promise = Promise.resolve(methods.get(method)).then(next, next);
      methods.set(method, promise);
      return promise;
    } as T;
  }
  return descriptor;
}
