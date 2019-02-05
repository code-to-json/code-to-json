import { Dict } from '@mike-north/types';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as ts from 'typescript';
import { mapDict } from '../src/dict';
import { createProgramFromCodeString } from '../src/program';
import {
  getRelevantTypesForSymbol,
  getTypeStringForRelevantTypes,
  SymbolRelevantTypes,
} from '../src/symbol';

@suite
export class SymbolUtilityTests {
  private sf!: ts.SourceFile;

  private sfSym!: ts.Symbol;

  private exports!: Dict<{ sym: ts.Symbol; typ: SymbolRelevantTypes; typStr: string }>;

  private checker!: ts.TypeChecker;

  public before(): void {
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
    const sf = p.getSourceFile('module.ts');
    if (!sf) {
      throw new Error('No source file module.ts found');
    }
    this.sf = sf;
    this.checker = p.getTypeChecker();
    const sfSym = this.checker.getSymbolAtLocation(this.sf);
    if (!sfSym) {
      throw new Error('SourceFile has no symbol');
    }
    this.sfSym = sfSym;

    this.exports = mapDict(this.sfSym.exports!, (exp) => {
      const typ = getRelevantTypesForSymbol(this.checker, exp)!;
      return {
        sym: exp,
        typ,
        typStr: getTypeStringForRelevantTypes(this.checker, typ),
      };
    });
  }

  @test
  public 'relevantTypeForSymbol - simple variable'(): void {
    expect(this.exports.x!.typStr).to.eql('number');
  }

  @test
  public 'relevantTypeForSymbol - class'(): void {
    expect(this.checker.typeToString(this.exports.Foo!.typ.valueDeclarationType!)).to.eql(
      'typeof Foo',
    );
    expect(this.checker.typeToString(this.exports.Foo!.typ.symbolType!)).to.eql('Foo');
    expect(this.exports.Foo!.typStr).to.eql('Foo\ntypeof Foo');
  }

  @test
  public 'relevantTypeForSymbol - anonymous structured type'(): void {
    expect(this.exports.helloFn!.typStr).to.eql('{ foo: () => string; }');
  }

  @test
  public 'relevantTypeForSymbol - interface'(): void {
    expect(this.exports.CondTyp!.typStr).to.eql('CondTyp<T>');
  }

  @test
  public 'relevantTypeForSymbol - function'(): void {
    expect(this.exports.addToX!.typStr).to.eql('(y: number) => number');
  }

  @test
  public 'relevantTypeForSymbol - type query'(): void {
    expect(this.exports.myTypeQuery!.typStr).to.eql('{ fn: (y: number) => number; }');
  }

  @test
  public 'relevantTypeForSymbol - type alias'(): void {
    expect(this.exports.CondTyp!.typStr).to.eql('CondTyp<T>');
  }

  @test.skip
  public 'relevantTypeForSymbol - type parameter'(): void {
    const dictType = this.exports.Dict!.typ.symbolType! as ts.InterfaceType;
    const { typeParameters } = dictType;
    if (!typeParameters) {
      throw new Error('undefined typeParameters');
    }
    const typeParam = typeParameters.values().next().value;
    const typeParamSym = typeParam.symbol;
    expect(this.checker.typeToString(typeParam)).to.eql('T');
    expect(
      this.checker.typeToString(getRelevantTypesForSymbol(this.checker, typeParamSym)!.symbolType!),
    ).to.eql('T');
  }

  @test
  public 'relevantTypeForSymbol - enum collection'(): void {
    expect(this.checker.typeToString(this.exports.Suit!.typ.valueDeclarationType!)).to.eql(
      'typeof Suit',
    );
    expect(this.checker.typeToString(this.exports.Suit!.typ.symbolType!)).to.eql('Suit');
  }

  @test
  public 'relevantTypeForSymbol - mapped type'(): void {
    expect(this.exports.MyMapped!.typStr).to.eql('MyMapped<K>');
  }

  @test
  public 'relevantTypeForSymbol - enum member'(): void {
    expect(this.exports.favSuit!.typStr).to.eql('Suit.Heart');
    expect(!!this.exports.favSuit!.typ.symbolType).to.eq(false);
    expect(!!this.exports.favSuit!.typ.valueDeclarationType).to.eq(true);
    expect(this.checker.typeToString(this.exports.favSuit!.typ.valueDeclarationType!)).to.eq(
      'Suit.Heart',
    );
  }
}
