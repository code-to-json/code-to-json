import { Dict } from '@mike-north/types';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import * as ts from 'typescript';
import { mapDict } from '../src/dict';
import { createProgramFromCodeString } from '../src/program';
import {
  getRelevantTypesForSymbol,
  getTypeStringForRelevantTypes,
  SymbolRelevantTypes,
} from '../src/symbol';

describe('Symbol utility tests', () => {
  let sf: ts.SourceFile;

  let sfSym: ts.Symbol;

  let exports: Dict<{ sym: ts.Symbol; typ: SymbolRelevantTypes; typStr: string }>;

  let checker: ts.TypeChecker;

  before(() => {
    const code = `export class Foo { bar: string; };
export let x: number = 4;
export let str: string = 'abc';
export let boolVal = true;
export const myFoo = new Foo();

export type CondTyp<T> = T extends string ? T[] : T;
export interface NumberDict { [k: string]: number };
export interface Dict<T> { [k: string]: T | undefined };

export const myTuple: [number, string, number] = [42, 'the meaning of life', 42];

export const helloFn: { foo: () => string } = { foo: () => 'hello' };

export function addToX(y: number): number { return x + y; }

export let myTypeQuery: { fn: typeof addToX};

export interface MyMapInterface {
    foo: 'FOO';
    bar: 'BAR';
}

export type MyMapped<K extends keyof MyMapInterface> = { [KK in K]: MyMapInterface[K] };

export enum Suit { Heart, Club, Spade, Diamond };
export const favSuit = Suit.Heart;
`;
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

    exports = mapDict(sfSym.exports!, exp => {
      const typ = getRelevantTypesForSymbol(checker, exp)!;
      return {
        sym: exp,
        typ,
        typStr: getTypeStringForRelevantTypes(checker, typ),
      };
    });
  });

  it('relevantTypeForSymbol - simple variable', () => {
    expect(exports.x!.typStr).to.eql('number');
  });

  it('relevantTypeForSymbol - class', () => {
    expect(checker.typeToString(exports.Foo!.typ.valueDeclarationType!)).to.eql('typeof Foo');
    expect(checker.typeToString(exports.Foo!.typ.symbolType!)).to.eql('Foo');
    expect(exports.Foo!.typStr).to.eql('Foo\ntypeof Foo');
  });

  it('relevantTypeForSymbol - anonymous structured type', () => {
    expect(exports.helloFn!.typStr).to.eql('{ foo: () => string; }');
  });

  it('relevantTypeForSymbol - interface', () => {
    expect(exports.CondTyp!.typStr).to.eql('CondTyp<T>');
  });

  it('relevantTypeForSymbol - function', () => {
    expect(exports.addToX!.typStr).to.eql('(y: number) => number');
  });

  it('relevantTypeForSymbol - type query', () => {
    expect(exports.myTypeQuery!.typStr).to.eql('{ fn: (y: number) => number; }');
  });

  it('relevantTypeForSymbol - type alias', () => {
    expect(exports.CondTyp!.typStr).to.eql('CondTyp<T>');
  });

  it.skip('relevantTypeForSymbol - type parameter', () => {
    const dictType = exports.Dict!.typ.symbolType! as ts.InterfaceType;
    const { typeParameters } = dictType;
    if (!typeParameters) {
      throw new Error('undefined typeParameters');
    }
    const typeParam = typeParameters.values().next().value;
    const typeParamSym = typeParam.symbol;
    expect(checker.typeToString(typeParam)).to.eql('T');
    expect(
      checker.typeToString(getRelevantTypesForSymbol(checker, typeParamSym)!.symbolType!),
    ).to.eql('T');
  });

  it('relevantTypeForSymbol - enum collection', () => {
    expect(checker.typeToString(exports.Suit!.typ.valueDeclarationType!)).to.eql('typeof Suit');
    expect(checker.typeToString(exports.Suit!.typ.symbolType!)).to.eql('Suit');
  });

  it('relevantTypeForSymbol - mapped type', () => {
    expect(exports.MyMapped!.typStr).to.eql('MyMapped<K>');
  });

  it('relevantTypeForSymbol - enum member', () => {
    expect(exports.favSuit!.typStr).to.eql('Suit.Heart');
    expect(!!exports.favSuit!.typ.symbolType).to.eq(false);
    expect(!!exports.favSuit!.typ.valueDeclarationType).to.eq(true);
    expect(checker.typeToString(exports.favSuit!.typ.valueDeclarationType!)).to.eq('Suit.Heart');
  });
});
