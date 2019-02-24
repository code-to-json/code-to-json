import { Dict } from '@mike-north/types';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import * as ts from 'typescript';
import {
  createProgramFromCodeString,
  getRelevantTypesForSymbol,
  isAnonymousType,
  isConditionalType,
  isDeclaration,
  isInterfaceType,
  isNode,
  isObjectReferenceType,
  isObjectType,
  isPrimitiveType,
  isSymbol,
  isType,
  mapDict,
  SymbolRelevantTypes,
} from '../src/index';

describe('Guard tests', () => {
  let sf: ts.SourceFile;

  let sfSym: ts.Symbol;

  let sfType: ts.Type;

  let exports: Dict<{ sym: ts.Symbol; typ: SymbolRelevantTypes }>;

  let checker: ts.TypeChecker;

  before(() => {
    const code = `export class Foo { bar: string; };
export let x: number = 4;
export let str: string = 'abc';
export let boolVal = true;
export const myFoo = new Foo();

export type CondTyp<T> = T extends string ? T[] : T;
export interface NumberDict { [k: string]: number };

export const myTuple: [number, string, number] = [42, 'the meaning of life', 42];

export const helloFn: { foo: () => string } = { foo: () => 'hello' };

export function addToX(y: number): number { return x + y; }`;
    const out = createProgramFromCodeString(code, 'ts');
    const p = out.program;
    sf = p.getSourceFile('module.ts')!;
    if (!sf) {
      throw new Error('No source file module.ts found');
    }
    checker = p.getTypeChecker();
    sfSym = checker.getSymbolAtLocation(sf)!;
    if (!sfSym) {
      throw new Error('SourceFile has no symbol');
    }
    sfType = getRelevantTypesForSymbol(checker, sfSym)!.valueDeclarationType!;
    if (!sfType) {
      throw new Error('Source file type could not be obtained');
    }
    exports = mapDict(sfSym.exports!, exp => ({
      sym: exp,
      typ: getRelevantTypesForSymbol(checker, exp)!,
    }));
  });

  it('isDeclaration', () => {
    expect(isDeclaration(sf)).to.eql(true, 'SourceFile is a declaration');
  });

  it('isNode', () => {
    expect(isNode(sf)).to.eql(true, 'SourceFile is a node');
  });

  it('isSymbol', () => {
    expect(isSymbol(sf)).to.eql(false, 'SourceFile is not a symbol');

    expect(isSymbol(sfSym)).to.eql(true, 'SourceFile symbol is a symbol');
    const mySfType = checker.getTypeOfSymbolAtLocation(sfSym, sf);
    expect(isSymbol(mySfType)).to.eql(false, 'SourceFile symbol type is not a symbol');
  });

  it('isType', () => {
    expect(isType(sf)).to.eql(false, 'SourceFile is not a type');

    expect(isType(sfSym)).to.eql(false, 'SourceFile symbol is not a type');
    const mySfType = checker.getTypeOfSymbolAtLocation(sfSym, sf);
    expect(isType(mySfType)).to.eql(true, 'SourceFile symbol type is a type');
  });

  it('isObjectType', () => {
    expect(isObjectType(exports.Foo!.typ.valueDeclarationType!)).to.eql(
      true,
      'class is an object type',
    );
    expect(isObjectType(exports.x!.typ.valueDeclarationType!)).to.eql(
      false,
      'number is not an object type',
    );
  });

  it('isObjectReferenceType', () => {
    expect(isObjectReferenceType(exports.myFoo!.typ.valueDeclarationType!)).to.eql(
      true,
      'Class instance type is a reference type',
    );
    expect(isObjectReferenceType(sfType)).to.eql(false, 'SourceFile type is not a reference type');
  });

  it('isInterfaceType', () => {
    expect(isInterfaceType(exports.myFoo!.typ.valueDeclarationType!)).to.eql(
      true,
      'Class instance type is a class/interface type',
    );
    expect(isInterfaceType(exports.Foo!.typ.valueDeclarationType!)).to.eql(
      false,
      'Class constructor type is not a class/interface type',
    );
    expect(isInterfaceType(sfType)).to.eql(false, 'SourceFile type is not a class/interface type');
  });

  it('isAnonymousType', () => {
    expect(isAnonymousType(exports.helloFn!.typ.valueDeclarationType!)).to.eql(
      true,
      'helloFn type is anonymous',
    );
    expect(isAnonymousType(exports.myFoo!.typ.valueDeclarationType!)).to.eql(
      false,
      'Class instance type is not anonymous',
    );
  });

  it('isConditionalType', () => {
    expect(isConditionalType(exports.CondTyp!.typ.symbolType!)).to.eql(
      true,
      'CondTyp type is conditional',
    );
    expect(isConditionalType(exports.helloFn!.typ.valueDeclarationType!)).to.eql(
      false,
      'helloFn type is not conditional',
    );
  });

  it('isPrimitiveType', () => {
    expect(isPrimitiveType(exports.x!.typ.valueDeclarationType!)).to.eql(
      true,
      'number is a primitive type',
    );
    expect(isPrimitiveType(exports.str!.typ.valueDeclarationType!)).to.eql(
      true,
      'string is a primitive type',
    );
    expect(isPrimitiveType(exports.boolVal!.typ.valueDeclarationType!)).to.eql(
      true,
      'boolean is a primitive type',
    );
    expect(isPrimitiveType(sfType)).to.eql(false, 'SourceFile type is not primitive');
  });
});
