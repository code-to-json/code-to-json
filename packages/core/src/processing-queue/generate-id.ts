// tslint:disable:no-bitwise
import { isDeclaration, isNode, isSymbol, isType, UnreachableError } from '@code-to-json/utils';
import { isSourceFile, Node, Symbol as Sym, Type } from 'typescript';

/**
 * Generate a stable hash from a string
 * @param str string to generate a hash from
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
 */
export function generateId(thing: Sym | Node | Type): string {
  if (!thing) {
    debugger;
  }
  if (isType(thing)) {
    // tslint:disable-next-line:no-useless-cast
    return (thing as any).id;
  } else if (isSymbol(thing)) {
    const parts: any[] = [thing.name, thing.flags];
    const { valueDeclaration } = thing;
    if (valueDeclaration) {
      parts.push(valueDeclaration.pos);
      parts.push(valueDeclaration.end);
    }
    return generateHash(parts.filter(Boolean).join('-'));
  } else if (thing && isSourceFile(thing)) {
    return generateHash(thing.fileName);
  } else if (isDeclaration(thing)) {
    return generateHash(thing.getFullText());
  } else if (isNode(thing)) {
    return generateHash(thing.getFullText());
  } else {
    // tslint:disable-next-line:no-console
    console.error(thing);
    throw new UnreachableError(thing, 'Cannot generate an id for this object');
  }
}
