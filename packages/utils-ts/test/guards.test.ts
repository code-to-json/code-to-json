import { isDefined } from '@code-to-json/utils';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as ts from 'typescript';
import {
  createProgramFromCodeString,
  isDeclaration,
  isNamedDeclaration,
  isNode,
  isSymbol,
  isType,
  mapDict,
} from '../src/index';

@suite('Guard tests')
export class GuardTests {
  private sf!: ts.SourceFile;

  private sfSym!: ts.Symbol;

  private checker!: ts.TypeChecker;

  public before() {
    const code = `export class Foo { bar: string; };
let x: number = 4;
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
    const allExports = mapDict(exports, sym => sym.declarations[0]);
    expect(Object.keys(allExports).length).to.eql(2);
    const [firstExport, secondExport] = Object.keys(allExports)
      .map(e => allExports[e])
      .filter(isDefined);

    expect(firstExport.getText()).to.eql(
      'export function addToX(y: number): number { return x + y; }',
    );
    expect(isNamedDeclaration(firstExport)).to.eql(true, 'function is a named declaration');

    expect(secondExport.getText()).to.eql('export class Foo { bar: string; }');
    expect(isNamedDeclaration(secondExport)).to.eql(true, 'class is a named declaration');
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
}
