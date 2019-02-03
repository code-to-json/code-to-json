/* eslint-disable import/prefer-default-export */
import { Dict } from '@mike-north/types';
import * as ts from 'typescript';

function isUem<T>(dict: ts.UnderscoreEscapedMap<T> | Dict<T>): dict is ts.UnderscoreEscapedMap<T> {
  return typeof dict.clear === 'function';
}

/**
 * Invoke a callback for each key-value pair in a dictionary
 * @param dict dictionary to iterate over
 * @param callback mapping function to apply to each key-value pair
 * @public
 */
export function forEachDict<T>(
  dict: ts.UnderscoreEscapedMap<T> | Dict<T>,
  cb: (t: T, key: ts.__String | string) => void,
): void {
  if (isUem(dict)) {
    dict.forEach(cb);
  } else {
    Object.keys(dict).forEach(key => {
      const item = dict[key] as T;
      cb(item, key);
    });
  }
}

/**
 * Map over a dictionary
 * @param dict dictionary to iterate over
 * @param callback mapping function to apply to each key-value pair
 * @public
 */
export function mapDict<T, S>(
  dict: ts.UnderscoreEscapedMap<T> | Dict<T>,
  callback: (t: T, key: ts.__String | string) => S | undefined,
): Dict<S> {
  return reduceDict(
    dict,
    (d, item, key) => {
      const transformed = callback(item, key);
      if (typeof transformed !== 'undefined') {
        // eslint-disable-next-line no-param-reassign
        d[key.toString()] = transformed;
      }
      return d;
    },
    {} as Dict<S>,
  );
}

/**
 * Filter a dictionary
 * @param dict dictionary to iterate over
 * @param callback mapping function to apply to each key-value pair
 * @public
 */
export function filterDict<T>(
  dict: ts.UnderscoreEscapedMap<T> | Dict<T>,
  filterFn: (t: T, key: ts.__String | string) => boolean,
): Dict<T> {
  return reduceDict(
    dict,
    (d, item, key) => {
      if (filterFn(item, key)) {
        // eslint-disable-next-line no-param-reassign
        d[typeof key === 'string' ? key : key.toString()] = item;
      }

      return d;
    },
    {} as Dict<T>,
  );
}

/**
 * Reduce a dictionary
 * @param dict dictionary to iterate over
 * @param callback mapping function to apply to each key-value pair
 * @public
 */
export function reduceDict<T, R>(
  dict: ts.UnderscoreEscapedMap<T> | Dict<T>,
  callback: (reduced: R, t: T, key: ts.__String | string) => R,
  initial: R,
): R {
  let reducedVal: R = initial;
  forEachDict(dict, (val, key) => {
    reducedVal = callback(reducedVal, val, key);
  });
  return reducedVal;
}
