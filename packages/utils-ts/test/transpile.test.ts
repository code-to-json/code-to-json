import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { transpileTsString } from '../src/index';

@suite('String to TypeScript program tests')
class TranspileProgramTest {
  @test
  public 'simple program'(): void {
    const out = transpileTsString('export let x: number = 4;');
    const sourceFileNames = out.program.getSourceFiles().map(sf => sf.fileName);
    expect(sourceFileNames.length).to.eql(1);
    expect(sourceFileNames.join(',')).to.eql('module.ts');

    const firstFile = out.program.getSourceFiles()[0];
    expect(firstFile.getText()).to.eql('export let x: number = 4;');

    const checker = out.program.getTypeChecker();
    const sym = checker.getSymbolAtLocation(firstFile);
    if (!sym) {
      throw new Error('No symbol for source file');
    }
    const { exports } = sym;
    if (!exports) {
      throw new Error('No exports from source file');
    }
    expect(exports.size).to.be.greaterThan(0);
    expect(out.output).to.eql('');
    out.program.emit();
    expect(out.output.replace(/[\s]+/g, ' ').trim()).to.eql(
      'define(["require", "exports"], function (require, exports) { ' +
        '"use strict"; ' +
        'Object.defineProperty(exports, "__esModule", { value: true }); ' +
        'exports.x = 4; ' +
        '});',
    );
  }
}
