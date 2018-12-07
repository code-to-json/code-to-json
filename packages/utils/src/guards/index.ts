export * from './ts/node';

export function isObject<T extends object>(val?: T): val is T {
  return typeof val !== 'undefined';
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
export function isHomogenousArray<T>(value: any, validator: (v: any) => boolean): value is T[] {
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
