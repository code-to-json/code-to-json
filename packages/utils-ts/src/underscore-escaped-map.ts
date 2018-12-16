/* eslint-disable import/prefer-default-export */
import { __String, UnderscoreEscapedMap } from 'typescript';

/**
 * Map over an UnderscoreEscapedMap
 * @param uem UnderscoreEscapedMap to iterate over
 * @param callback mapping function to apply to each key-value pair
 */
export function mapUem<T, S>(
  uem: UnderscoreEscapedMap<T>,
  callback: ((t: T, key: __String) => S),
): S[] {
  const arr: S[] = [];
  uem.forEach((val, key) => {
    arr.push(callback(val, key));
  });
  return arr;
}
