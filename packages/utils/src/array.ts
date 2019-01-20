/**
 * Check whether any members of an array pass a check
 * @param target array to evaluate
 * @param predicate check to perform
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

export function forEach<T>(
  array: T[] | ReadonlyArray<T> | undefined,
  callback: (item: T, idx: number) => void,
): void {
  if (!array) {
    return;
  }
  (array.forEach as any)(callback);
}
