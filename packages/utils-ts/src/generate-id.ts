/* eslint-disable no-bitwise */
// tslint:disable:no-bitwise
import { UnreachableError } from '@code-to-json/utils';
import * as debug from 'debug';
import { Declaration, isSourceFile, Node, Symbol as Sym, Type, TypeChecker } from 'typescript';
import { isDeclaration, isNode, isSymbol, isType } from './guards';

const log = debug('code-to-json:generate-id');
/**
 * Generate a stable hash from a string
 * @param str string to generate a hash from
 */
export function generateHash(str: string): string {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
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

function generateTypeId(thing: Type, checker: TypeChecker): string {
  const { symbol } = thing;
  const valueDeclaration: Declaration | null = symbol ? symbol.valueDeclaration : null;
  if (symbol && valueDeclaration) {
    return generateHash(valueDeclaration.getText());
  }
  return generateHash(checker.typeToString(thing));
}

/** @internal */
export function generateIdForSourceFileName(fileName: string): string {
  return generateHash(
    fileName.substr(Math.max(0, fileName.length - 10)).replace(/[\\/:"'`.-\s]+/g, ''),
  );
}

/**
 * Generate an id for an entity
 * @param thing Entity to generate an Id for
 */
export function generateId(thing: Type, checker: TypeChecker): string;
export function generateId(thing: Sym | Node): string;
export function generateId(thing: Sym | Node | Type, checker?: TypeChecker): string {
  if (typeof thing === 'undefined' || thing === null) {
    throw new Error('Cannot generate an ID for empty values');
  }
  if (isType(thing)) {
    return generateTypeId(thing, checker!);
  }
  if (isSymbol(thing)) {
    const { valueDeclaration } = thing;
    const parts: Array<string | number> = [thing.flags, thing.name];
    if (valueDeclaration) {
      return generateHash(valueDeclaration.getText());
    }
    return generateHash(parts.filter(Boolean).join('-'));
  }
  if (isSourceFile(thing)) {
    const { fileName, end, pos, flags } = thing;
    return generateIdForSourceFileName(fileName + pos + end + flags);
  }
  if (isDeclaration(thing)) {
    return generateHash(thing.getText());
  }
  if (isNode(thing)) {
    return generateHash(thing.getText());
  }
  log(thing);
  throw new UnreachableError(thing, 'Cannot generate an id for this object');
}
