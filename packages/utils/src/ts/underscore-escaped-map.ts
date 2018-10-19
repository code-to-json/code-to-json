import * as ts from 'typescript';

export function mapUem<T, S>(
  uem: ts.UnderscoreEscapedMap<T>,
  callback: ((t: T, key: ts.__String) => S)
): S[] {
  const arr: S[] = [];
  uem.forEach((val, key) => {
    arr.push(callback(val, key));
  });
  return arr;
}
