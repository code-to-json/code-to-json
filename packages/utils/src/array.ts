/**
 * Check whether any members of an array pass a check
 * @param target array to evaluate
 * @param predicate check to perform
 * @public
 */
export function some<T>(target: T[], predicate: (val: T) => boolean): boolean {
  for (const i in target) {
    if (predicate(target[i])) {
      return true;
    }
  }
  return false;
}

/**
 * Check whether all members of an array pass a check
 * @param target array to evaluate
 * @param predicate check to perform
 * @public
 */
export function all<T>(target: T[], predicate: (val: T) => boolean): boolean {
  for (const i in target) {
    if (!predicate(target[i])) {
      return false;
    }
  }
  return true;
}

/**
 * Check to see whether a value is an array
 * @param value value to check
 * @public
 */
export function isArray(value: any): value is any[];
export function isArray<T>(value?: T[]): value is T[];
export function isArray(value: any): value is any[] {
  return value instanceof Array;
}

/**
 * Check to see if a value is a homogenous array
 * @param value value to check
 * @param validator validator to apply to each member of the collection
 * @public
 */
export function isHomogenousArray<T>(value: any[], validator: (v: any) => boolean): value is T[] {
  if (!isArray(value)) {
    return false;
  }
  for (const v of value) {
    if (!validator(v)) {
      return false;
    }
  }
  return true;
}

/**
 * Invoke a callback for each member of an array
 *
 * @param array array to iterate over
 * @param callback callback to invoke for each member of the array
 * @public
 */
export function forEach<T>(
  array: T[] | ReadonlyArray<T> | undefined,
  callback: (item: T, idx: number) => void,
): void {
  if (!array) {
    return;
  }
  (array.forEach as any)(callback);
}
