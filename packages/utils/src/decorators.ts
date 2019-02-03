import { ExtractPropertyNamesOfType } from '@mike-north/types';

function createMemoized<A extends object, R>(fn: (arg: A) => R): (arg: A) => R {
  const cache = new WeakMap<A, R>();
  return function memoizedFn(arg: A): R {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }
    const newVal = fn(arg);
    cache.set(arg, newVal);
    return newVal;
  };
}

/**
 * Apply a simple caching layer to a unary method
 *
 * @param target class containing the method
 * @param propertyKey name of method
 * @param _descriptor property descriptor
 * @public
 */
export function memoize<
  T,
  O extends object,
  K extends ExtractPropertyNamesOfType<O, (arg: any) => any>
>(
  target: O,
  propertyKey: K,
  _descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> | void {
  const original = target[propertyKey];
  // eslint-disable-next-line no-param-reassign
  target.constructor.prototype[propertyKey] = createMemoized(original as any) as any;
}
