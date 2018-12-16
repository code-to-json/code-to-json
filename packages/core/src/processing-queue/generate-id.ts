// tslint:disable:no-bitwise
import { UnreachableError } from '@code-to-json/utils';
import { isDeclaration, isNode, isSymbol, isType } from '@code-to-json/utils-ts';
import * as debug from 'debug';
import { isSourceFile, Node, Symbol as Sym, Type } from 'typescript';
const log = debug('code-to-json:generate-id');
/**
 * Generate a stable hash from a string
 * @param str string to generate a hash from
 * @internal
 */
function generateHash(str: string): string {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 341) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  // Convert the possibly negative integer hash code into an 8 character hex string, which isn't
  // strictly necessary but increases user understanding that the id is a SHA-like hash
  let hex = (0x10000000000000 + hash).toString(35);
  if (hex.length < 16) {
    hex = '0000000' + hex;
  }

  return hex.slice(-12);
}

/**
 * Generate an id for an entity
 * @param thing Entity to generate an Id for
 * @internal
 */
export function generateId(thing: Sym | Node | Type): string {
  if (!thing) {
    debugger;
  }
  if (isType(thing)) {
    // tslint:disable-next-line:no-useless-cast
    const typeId = (thing as any).id;
    return `${typeId}`;
  } else if (isSymbol(thing)) {
    const parts: Array<string | number> = [thing.name, thing.flags];
    const { valueDeclaration } = thing;
    if (valueDeclaration) {
      parts.push(valueDeclaration.pos);
      parts.push(valueDeclaration.end);
    }
    return generateHash(parts.filter(Boolean).join('-'));
  } else if (thing && isSourceFile(thing)) {
    return thing.fileName;
  } else if (isDeclaration(thing)) {
    return generateHash(thing.getFullText());
  } else if (isNode(thing)) {
    return generateHash(thing.getFullText());
  } else {
    log(thing);
    throw new UnreachableError(thing, 'Cannot generate an id for this object');
  }
}
