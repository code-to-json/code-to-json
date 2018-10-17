import * as ts from 'typescript';

export function mapChildren<T>(
  node: ts.Node,
  mapper: (child: ts.Node) => T
): T[] {
  const arr: T[] = [];
  ts.forEachChild(node, (child: ts.Node) => {
    arr.push(mapper(child));
  });
  return arr;
}

export function flagsToString(
  flags: number,
  flagMap: { [flag: string]: number }
): string[] | string | null {
  const flagNames = [] as string[];
  const keys = Object.keys(flagMap);
  for (let i = 0; i < keys.length && flags !== 0; i++) {
    const flagName = keys[i];
    const flag = flagMap[flagName];
    if (flag === 0) {
      continue;
    }
    // tslint:disable-next-line:no-bitwise
    if ((flag & flags) === flag) {
      // tslint:disable-next-line:no-bitwise
      flags &= ~flag;
      flagNames.push(flagName);
    }
  }
  if (flagNames.length === 0) {
    return null;
  }
  if (flagNames.length === 1) {
    return flagNames[0];
  }
  return flagNames;
}
