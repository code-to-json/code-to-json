/**
 * Determine whether a value *isn't* undefined
 * @param t the value to check
 * @public
 */
export function isDefined<T>(t: T | undefined): t is T {
  return typeof t !== 'undefined';
}

/**
 * Determine whether a value *isn't* null
 * @param t the value to check
 * @public
 */
export function isNotNull<T>(t: T | null): t is T {
  return t !== null;
}
