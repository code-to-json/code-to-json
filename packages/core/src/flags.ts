/* eslint-disable no-bitwise */
import {
  ModifierFlags,
  NodeBuilderFlags,
  NodeFlags,
  ObjectFlags,
  ObjectType,
  SymbolFlags,
  SymbolFormatFlags,
  Type,
  TypeFlags,
} from 'typescript';

interface FlagsMap {
  type: TypeFlags;
  node: NodeFlags;
  object: ObjectFlags;
  nodeBuilder: NodeBuilderFlags;
  modifier: ModifierFlags;
  symbol: SymbolFlags;
  symbolFormat: SymbolFormatFlags;
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
      throw new Error(`Unsupported flag type: ${type}`);
  }
}

/**
 * Parse a flag bitmask into strings
 * @param flags
 * @param flagMap
 * @author Kris Selden <https://github.com/krisselden>
 * @internal
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
/**
 * Check whether a Type is an ObjectType
 * @param type ts.Type
 * @internal
 */
export function isObjectType(type: Type): type is ObjectType {
  // tslint:disable-next-line:no-bitwise
  return !!(type.flags & TypeFlags.Object);
}

/**
 * Get the object flags from a type
 * @param type bitmask of object flags
 * @internal
 */
export function getObjectFlags(type: Type): ObjectFlags | undefined {
  // tslint:disable-next-line:no-bitwise
  return isObjectType(type) ? type.objectFlags : undefined;
}

export type Flags = string[];
