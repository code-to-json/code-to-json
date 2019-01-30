import { Dict } from '@mike-north/types';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as ts from 'typescript';
import {
  createProgramFromCodeString,
  isAnonymousType,
  isClassOrInterfaceType,
  isConditionalType,
  isDeclaration,
  isNamedDeclaration,
  isNode,
  isObjectReferenceType,
  isObjectType,
  isPrimitiveType,
  isSymbol,
  isType,
  mapDict,
  relevantTypeForSymbol,
} from '../src/index';

@suite('Guard tests')
export class GuardTests {
  private sf!: ts.SourceFile;

  private sfSym!: ts.Symbol;

  private sfType!: ts.Type;

  private exports!: Dict<{ sym: ts.Symbol; typ: ts.Type }>;

  private checker!: ts.TypeChecker;

  public before() {
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
    this.sfType = relevantTypeForSymbol(this.checker, sfSym)!;

    this.exports = mapDict(this.sfSym.exports!, exp => {
      return {
        sym: exp,
        typ: relevantTypeForSymbol(this.checker, exp)!,
      };
    });
  }

  @test
  public isDeclaration(): void {
    expect(isDeclaration(this.sf)).to.eql(true, 'SourceFile is a declaration');
  }

  @test
  public isNamedDeclaration(): void {
    expect(isNamedDeclaration(this.sf)).to.eql(false, 'SourceFile is not a named declaration');
    const { exports } = this.sfSym;
    if (!exports) {
      throw new Error('SourceFile has no exports');
    }

    expect(this.exports!.addToX!.sym.declarations[0].getText()).to.eql(
      'export function addToX(y: number): number { return x + y; }',
    );
    expect(isNamedDeclaration(this.exports!.addToX!.sym.declarations[0])).to.eql(
      true,
      'function is a named declaration',
    );

    expect(this.exports!.Foo!.sym.declarations[0].getText()).to.eql(
      'export class Foo { bar: string; }',
    );
    expect(isNamedDeclaration(this.exports!.addToX!.sym.declarations[0])).to.eql(
      true,
      'class is a named declaration',
    );
  }

  @test
  public isNode(): void {
    expect(isNode(this.sf)).to.eql(true, 'SourceFile is a node');
  }

  @test
  public isSymbol(): void {
    expect(isSymbol(this.sf)).to.eql(false, 'SourceFile is not a symbol');

    expect(isSymbol(this.sfSym)).to.eql(true, 'SourceFile symbol is a symbol');
    const sfType = this.checker.getTypeOfSymbolAtLocation(this.sfSym, this.sf);
    expect(isSymbol(sfType)).to.eql(false, 'SourceFile symbol type is not a symbol');
  }

  @test
  public isType(): void {
    expect(isType(this.sf)).to.eql(false, 'SourceFile is not a type');

    expect(isType(this.sfSym)).to.eql(false, 'SourceFile symbol is not a type');
    const sfType = this.checker.getTypeOfSymbolAtLocation(this.sfSym, this.sf);
    expect(isType(sfType)).to.eql(true, 'SourceFile symbol type is a type');
  }

  @test
  public isObjectType(): void {
    expect(isObjectType(this.exports!.Foo!.typ)).to.eql(true, 'class is an object type');
    expect(isObjectType(this.exports!.x!.typ)).to.eql(false, 'number is not an object type');
  }

  @test
  public isObjectReferenceType(): void {
    expect(isObjectReferenceType(this.exports.myFoo!.typ as ts.ObjectType)).to.eql(
      true,
      'Class instance type is a reference type',
    );
    expect(isObjectReferenceType(this.sfType as ts.ObjectType)).to.eql(
      false,
      'SourceFile type is not a reference type',
    );
  }

  @test
  public isClassOrInterfaceType(): void {
    expect(isObjectReferenceType(this.exports.myFoo!.typ as ts.ObjectType)).to.eql(
      true,
      'Class instance type is a class/interface type',
    );
    expect(isObjectReferenceType(this.exports.Foo!.typ as ts.ObjectType)).to.eql(
      false,
      'Class constructor type is not a class/interface type',
    );
    expect(isClassOrInterfaceType(this.sfType as ts.ObjectType)).to.eql(
      false,
      'SourceFile type is not a class/interface type',
    );
  }

  @test
  public isAnonymousType(): void {
    expect(isAnonymousType(this.exports!.helloFn!.typ as ts.ObjectType)).to.eql(
      true,
      'helloFn type is anonymous',
    );
    expect(isAnonymousType(this.exports.myFoo!.typ as ts.ObjectType)).to.eql(
      false,
      'Class instance type is not anonymous',
    );
  }

  @test
  public isConditionalType(): void {
    expect(isConditionalType(this.exports!.CondTyp!.typ)).to.eql(
      true,
      'CondTyp type is conditional',
    );
    expect(isConditionalType(this.exports!.helloFn!.typ)).to.eql(
      false,
      'helloFn type is not conditional',
    );
  }

  @test
  public isPrimitiveType(): void {
    expect(isPrimitiveType(this.exports!.x!.typ)).to.eql(true, 'number is a primitive type');
    expect(isPrimitiveType(this.exports!.str!.typ)).to.eql(true, 'string is a primitive type');
    expect(isPrimitiveType(this.exports!.boolVal!.typ)).to.eql(true, 'boolean is a primitive type');
    expect(isPrimitiveType(this.sfType as ts.ObjectType)).to.eql(
      false,
      'SourceFile type is not primitive',
    );
  }
}
