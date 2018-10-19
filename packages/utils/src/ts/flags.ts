import * as ts from 'typescript';
import { Flags } from '../types';

interface FlagsMap {
  type: ts.TypeFlags;
  node: ts.NodeFlags;
  nodeBuilder: ts.NodeBuilderFlags;
  symbol: ts.SymbolFlags;
  symbolFormat: ts.SymbolFormatFlags;
}
function getFlagMap<T extends keyof FlagsMap>(type: T): { [k: string]: any } {
  switch (type) {
    case 'type':
      return ts.TypeFlags;
    case 'node':
      return ts.NodeFlags;
    case 'nodeBuilder':
      return ts.NodeBuilderFlags;
    case 'symbol':
      return ts.SymbolFlags;
    case 'symbolFormat':
      return ts.SymbolFormatFlags;
    default:
      throw new Error('Unsupported flag type: ' + type);
  }
}

/**
 * Parse a flag bitmask into strings
 * @param flags
 * @param flagMap
 * @author Kris Selden <https://github.com/krisselden>
 */
export function flagsToString<T extends keyof FlagsMap>(
  flags: FlagsMap[T],
  type: T
): Flags | undefined {
  const flagMap = getFlagMap<T>(type);
  const flagNames = [] as string[];
  const keys = Object.keys(flagMap);
  for (let i = 0; i < keys.length && flags !== 0; i++) {
    const flagName = keys[i];
    const flag = flagMap[flagName as string];
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
    return;
  }
  if (flagNames.length === 1) {
    return flagNames[0];
  }
  return flagNames;
}
