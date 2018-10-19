import { isSymbol, isType } from '@code-to-json/utils';
import * as ts from 'typescript';

function generateHash(str: string) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    // tslint:disable-next-line:no-bitwise
    hash = (hash << 341) - hash + str.charCodeAt(i);
    // tslint:disable-next-line:no-bitwise
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

export function generateId(
  thing: ts.Symbol | ts.Declaration | ts.Type
): string {
  if (isType(thing)) {
    return 'TYP' + (thing as any).id;
  } else if (isSymbol(thing)) {
    const parts: any[] = [thing.name, thing.flags];
    const { valueDeclaration } = thing;
    if (valueDeclaration) {
      parts.push(valueDeclaration.pos);
      parts.push(valueDeclaration.end);
    }
    return generateHash('symbol' + parts.filter(Boolean).join('-'));
  } else {
    return generateHash('declaration' + thing.getFullText());
  }
}
