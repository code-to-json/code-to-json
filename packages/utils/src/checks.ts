/**
 * Get a property from a target object
 * @param obj target
 * @param propname property name
 */
function get<O extends object, K extends keyof O>(obj: O, propname: K): O[K];
function get(obj: any, propname: string): any;
function get(obj: any, propname: string): any {
  if (obj && typeof obj === 'object') {
    return obj[propname];
  }
  return undefined;
}
// i
/**
 * Returns true if the passed value is null or undefined. This avoids errors
 * from JSLint complaining about use of ==, which can be technically
 * confusing.
 * ```ts
 * isNone();              // true
 * isNone(null);          // true
 * isNone(undefined);     // true
 * isNone('');            // false
 * isNone([]);            // false
 * isNone(function() {}); // false
 * ```
 * @note: copied from https://github.com/emberjs/ember.js/blob/5a8873bee19774a55fd0abfdcc7279f3efc768cd/packages/ember-metal/lib/is_none.ts#L25-L27
 */
export function isNone(obj: any): obj is null | undefined {
  return obj === null || obj === undefined;
}

/**
 * Verifies that a value is null or undefined, an empty string, or an empty array.
 * Constrains the rules on isNone by returning true for empty strings and empty arrays.
 * If the value is an object with a size property of type number, it is used to check emptiness.
 * @param obj
 */
// tslint:disable-next-line:max-union-size
export function isEmpty(obj: any): obj is null | undefined | 0 | { size: 0 } | [] | '' {
  const none = obj === null || obj === undefined;
  if (none) {
    return none;
  }

  if (typeof obj.size === 'number') {
    return !obj.size;
  }

  const objectType = typeof obj;

  if (objectType === 'object') {
    const size = get(obj, 'size');
    const length = get(obj, 'length');
    if (typeof size === 'number') {
      return !size;
    }
    if (typeof length === 'number') {
      return !length;
    }
  }

  if (typeof obj.length === 'number' && objectType !== 'function') {
    return !obj.length;
  }

  return false;
}

/**
 * Check a value for blankness
 * @param obj value to check for blankness
 * @see isPresent
 */
export function isBlank(obj: any): boolean {
  return isEmpty(obj) || (typeof obj === 'string' && /\S/.test(obj) === false);
}
/**
 * Check a value for non-blankness
 * @param obj object to check for presence
 * @see isBlank
 */
export function isPresent(obj: any): boolean {
  return !isBlank(obj);
}

export function isDefined<T>(t: T | null | undefined): t is T {
  return typeof t !== 'undefined';
}
