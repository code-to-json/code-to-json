/* eslint-disable no-bitwise */
// tslint:disable:no-bitwise
import { UnreachableError } from '@code-to-json/utils';
import * as debug from 'debug';
import {
  Declaration,
  isSourceFile,
  Iterator,
  Node,
  SourceFile,
  Symbol as Sym,
  SymbolFlags,
  Type,
  TypeChecker,
} from 'typescript';
import { flagsToString } from './flags';
import { isDeclaration, isNode, isSymbol, isType } from './typeguards';

const log = debug('code-to-json:generate-id');

function iteratorValues<T>(it: Iterator<T> | undefined, converter: (t: T) => string): string {
  if (!it) {
    return '';
  }
  const parts: string[] = [];
  let v = it.next();
  while (!v.done) {
    parts.push(converter(v.value));
    v = it.next();
  }
  return parts.join(', ');
}

function generateDuplicateIdErrorMessage(
  id: string,
  existing: IDableEntity[],
  thing: IDableEntity,
  checker: TypeChecker,
): string {
  return `Duplicate ID detected: ${id}
    existing: ${existing
      .map(e => entityToString(e, checker))
      // tslint:disable-next-line no-nested-template-literals
      .map(s => `   ${s}`)
      .join('\n')
      .trim()}
    second: ${entityToString(thing, checker)}`;
}

/**
 * Generate a stable hash from a string
 *
 * @param str string to generate a hash from
 * @public
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

/**
 * Stringify an entity
 *
 * @param thing entity to stringify
 * @param checker type-checker
 * @internal
 */
export function entityToString(thing: any, checker: TypeChecker): string {
  if (typeof thing === 'undefined') {
    return 'undefined';
  }
  if (typeof thing === 'string') {
    return thing;
  }
  if (isType(thing)) {
    return checker.typeToString(thing);
  }
  if (isSymbol(thing)) {
    return checker.symbolToString(thing);
  }
  if (isSourceFile(thing)) {
    return `FILE: ${thing.fileName}`;
  }
  if (isDeclaration(thing)) {
    return thing.getText();
  }
  if (isNode(thing)) {
    return thing.getText();
  }
  return `${thing}`;
}

/**
 * Entities that we can generate unique and stable IDs for
 */
export type IDableEntity = Sym | Node | Type | Declaration | SourceFile;

export type NewEntityGenerateIdResult = ['ok', string];
export type NewEntityWithRelatedGenerateIdResult = ['ok-related', string, IDableEntity[]];
export type GenerateIdResult = NewEntityGenerateIdResult | NewEntityWithRelatedGenerateIdResult;

/**
 * A utility for generating unique but stable ids for TypeScript compiler API entities
 */
export interface IdGenerator {
  /**
   * Generate an id for an entity
   * @param thing Entity to generate an Id for
   */
  // tslint:disable-next-line callable-types
  (thing: IDableEntity): GenerateIdResult;
}

function generateIdForSourceFileName(fileName: string): string {
  return generateHash(
    fileName.substr(Math.max(0, fileName.length - 10)).replace(/[\\/:"'`.-\s]+/g, ''),
  );
}

/**
 * Create an ID generator, using information from the provided type-checker
 *
 * @param checker type-checker
 */
export function createIdGenerator(checker: TypeChecker): IdGenerator {
  function generateIdForType(thing: Type): string {
    const { symbol } = thing;
    const valueDeclaration: Declaration | null = symbol ? symbol.valueDeclaration : null;
    const parts: Array<string | number> = [];
    if (thing.flags) {
      parts.push(thing.flags);
    }
    if (symbol && symbol.flags) {
      const { flags } = symbol;
      if (flags) {
        parts.push(flags);
        if (!(flags & SymbolFlags.ValueModule)) {
          parts.push(symbol.name);
          parts.push(checker.typeToString(thing));
          parts.push(checker.symbolToString(symbol));
        }
      }
    }
    if (valueDeclaration) {
      parts.push(valueDeclaration.kind);
      parts.push(valueDeclaration.getText());
      parts.push(valueDeclaration.pos);
      parts.push(valueDeclaration.end);
    }
    return generateHash(parts.join(''));
  }

  function generateIdForSymbol(thing: Sym): string {
    const parts: Array<string | number> = [
      (flagsToString(thing.flags & ~SymbolFlags.Transient, 'symbol') || []).join(''),
      iteratorValues(thing.exports ? thing.exports.keys() : undefined, s => s.toString()),
      iteratorValues(thing.members ? thing.members.keys() : undefined, s => s.toString()),
    ];
    const { valueDeclaration } = thing;
    if (!(thing.flags & SymbolFlags.ValueModule)) {
      parts.push(thing.name);
    }
    if (valueDeclaration) {
      parts.push(valueDeclaration.getText());
    }
    return generateHash(parts.filter(Boolean).join('-'));
  }

  function generateIdImpl(thing: IDableEntity): string {
    if (isType(thing)) {
      return `T${generateIdForType(thing)}`;
    }
    if (isSymbol(thing)) {
      return `S${generateIdForSymbol(thing)}`;
    }
    if (isSourceFile(thing)) {
      const { fileName, end, pos, flags } = thing;
      return `F${generateIdForSourceFileName(fileName + pos + end + flags)}`;
    }
    if (isDeclaration(thing)) {
      return `D${generateHash(thing.getText())}`;
    }
    if (isNode(thing)) {
      return `N${generateHash(thing.getText())}`;
    }
    log(thing);
    throw new UnreachableError(thing, 'Cannot generate an id for this object');
  }

  // Track IDs that have already been issued, to ensure there are never any duplicates
  const USED_IDS: {
    [k: string]: Array<[string, IDableEntity]> | undefined;
  } = {};

  return function generateId<T extends IDableEntity>(thing: T): GenerateIdResult {
    if (typeof thing === 'undefined' || thing === null) {
      throw new Error('Cannot generate an ID for empty values');
    }
    let id: string = generateIdImpl(thing);

    const existingEntities = USED_IDS[id];
    if (!existingEntities) {
      // first time we've seen this ID
      USED_IDS[id] = [[id, thing]];
      return ['ok', id];
    }

    if (existingEntities.length > 0) {
      // not the first time
      log(generateDuplicateIdErrorMessage(id, existingEntities.map(e => e[1]), thing, checker));
      id = `${id}1`;
      return ['ok-related', id, [...existingEntities.map(e => e[1])]];
    }
    throw new Error('Empty array detected in ID map');
  };
}
