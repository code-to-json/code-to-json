import * as ts from 'typescript';
import { isObjectType } from './typeguards';

/**
 * Get the object flags from a type
 * @param type bitmask of object flags
 * @public
 */
export function getObjectFlags(type: ts.Type): ts.ObjectFlags | undefined {
  return isObjectType(type) ? type.objectFlags : undefined;
}

export type Flags = string[];

export interface FlagsMap {
  type: ts.TypeFlags;
  node: ts.NodeFlags;
  object: ts.ObjectFlags;
  nodeBuilder: ts.NodeBuilderFlags;
  modifier: ts.ModifierFlags;
  symbol: ts.SymbolFlags;
  symbolFormat: ts.SymbolFormatFlags;
}

/**
 * Get a flag map object of a particular type
 * @param type type of flag map
 * @see flagsToString
 * @internal
 */
function getFlagMap<T extends keyof FlagsMap>(type: T): { [k: string]: any } {
  switch (type) {
    case 'type':
      return ts.TypeFlags;
    case 'object':
      return ts.ObjectFlags;
    case 'node':
      return ts.NodeFlags;
    case 'nodeBuilder':
      return ts.NodeBuilderFlags;
    case 'symbol':
      return ts.SymbolFlags;
    case 'symbolFormat':
      return ts.SymbolFormatFlags;
    default:
      throw new Error(`Unsupported flag type: ${type}`);
  }
}

/**
 * Parse a flag bitmask into strings
 * @param flags
 * @param flagMap
 * @author Kris Selden <https://github.com/krisselden>
 * @public
 */
export function flagsToString<T extends keyof FlagsMap>(
  flags: FlagsMap[T],
  type: T,
): Flags | undefined {
  let flg = flags;
  const flagMap = getFlagMap<T>(type);
  const flagNames = [] as string[];
  const keys = Object.keys(flagMap);
  for (let i = 0; i < keys.length && flg !== 0; i++) {
    const flagName = keys[i];
    const flag = flagMap[flagName];
    if (flag === 0) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // tslint:disable-next-line no-bitwise
    if ((flag & flg) === flag) {
      // tslint:disable-next-line no-bitwise
      flg &= ~flag;
      flagNames.push(flagName);
    }
  }
  if (flagNames.length === 0) {
    return undefined;
  }
  return flagNames;
}
