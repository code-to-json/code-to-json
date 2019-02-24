import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import * as ts from 'typescript';
import { createProgramFromCodeString, isDeclarationExported, mapDict } from '../src/index';

describe('Checks tests', () => {
  let sf: ts.SourceFile;

  let sfSym: ts.Symbol;

  let checker: ts.TypeChecker;

  before(() => {
    const code = `export class Foo { bar: string; };
let x: number = 4;
function addToX(y: number): number { return x + y; }`;
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
  });

  it('isDeclarationExported tests', () => {
    expect(isDeclarationExported(sf)).to.eql(false, 'SourceFile is not an exported declaration');
    const { exports } = sfSym;
    if (!exports) {
      throw new Error('SourceFile has no exports');
    }
    if (!exports) {
      throw new Error('SourceFile has no exports');
    }
    const allExports = mapDict(exports, sym => sym.declarations[0]);
    expect(Object.keys(allExports).length).to.eql(1);

    expect(sf.statements.length).to.eql(4);
    expect(sf.statements[3].getText()).to.eql(
      'function addToX(y: number): number { return x + y; }',
    );
    const firstExport = allExports[Object.keys(allExports)[0]];
    if (!firstExport) {
      throw new Error('Expected to find an export');
    }
    expect(isDeclarationExported(firstExport)).to.eq(true);
  });
});
