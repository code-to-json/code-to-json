/* eslint-disable no-bitwise */
// tslint:disable:no-bitwise
import { UnreachableError } from '@code-to-json/utils';
import * as debug from 'debug';
import { isSourceFile, Node, Symbol as Sym, Type } from 'typescript';
import { isDeclaration, isNode, isSymbol, isType } from './guards';

const log = debug('code-to-json:generate-id');
/**
 * Generate a stable hash from a string
 * @param str string to generate a hash from
 */
export function generateHash(str: string): string {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 341) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  // Convert the possibly negative integer hash code into an 8 character hex string, which isn't
  // strictly necessary but increases user understanding that the id is a SHA-like hash
  let hex = (0x10000000000000 + hash).toString(35);
  if (hex.length < 16) {
    hex = `0000000${hex}`;
  }

  return hex.slice(-12);
}

/**
 * Generate an id for an entity
 * @param thing Entity to generate an Id for
 */
export function generateId(thing: Sym | Node | Type): string {
  if (typeof thing === 'undefined' || thing === null) {
    throw new Error('Cannot generate an ID for empty values');
  }
  if (isType(thing)) {
    // tslint:disable-next-line:no-useless-cast
    const typeId = (thing as any).id;
    return `${typeId}`;
  }
  if (isSymbol(thing)) {
    const parts: Array<string | number> = [thing.name, thing.flags];
    const { valueDeclaration } = thing;
    if (valueDeclaration) {
      parts.push(valueDeclaration.pos);
      parts.push(valueDeclaration.end);
    }
    return generateHash(parts.filter(Boolean).join('-'));
  }
  if (thing && isSourceFile(thing)) {
    return generateHash(thing.fileName);
  }
  if (isDeclaration(thing)) {
    return generateHash(thing.getFullText());
  }
  if (isNode(thing)) {
    return generateHash(thing.getFullText());
  }
  log(thing);
  throw new UnreachableError(thing, 'Cannot generate an id for this object');
}
