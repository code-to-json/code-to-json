import {
  NodeBuilderFlags,
  NodeFlags,
  ObjectFlags,
  ObjectType,
  SymbolFlags,
  SymbolFormatFlags,
  Type,
  TypeFlags
} from 'typescript';
import { Flags } from '../types';

interface FlagsMap {
  type: TypeFlags;
  node: NodeFlags;
  object: ObjectFlags;
  nodeBuilder: NodeBuilderFlags;
  symbol: SymbolFlags;
  symbolFormat: SymbolFormatFlags;
}

/**
 * Get a flag map object
 * @param type type of flag map
 * @see flagsToString
 */
function getFlagMap<T extends keyof FlagsMap>(type: T): { [k: string]: any } {
  switch (type) {
    case 'type':
      return TypeFlags;
    case 'object':
      return ObjectFlags;
    case 'node':
      return NodeFlags;
    case 'nodeBuilder':
      return NodeBuilderFlags;
    case 'symbol':
      return SymbolFlags;
    case 'symbolFormat':
      return SymbolFormatFlags;
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

/**
 * Get the object flags from a type
 * @param type bitmask of object flags
 */
export function getObjectFlags(type: Type): ObjectFlags | undefined {
  // tslint:disable-next-line:no-bitwise
  return type.flags & TypeFlags.Object ? (type as ObjectType).objectFlags : undefined;
}
