import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { stringToProgram } from '../src/index';

@suite('String to TypeScript program tests')
class StringToTsProgramTest {
  @test
  public 'one-line program'(): void {
    const out = stringToProgram('export let x: number = 4;');
    const sourceFileNames = out.getSourceFiles().map(sf => sf.fileName);
    expect(sourceFileNames.length).to.eql(1);
    expect(sourceFileNames.join(',')).to.eql('module.ts');

    const firstFile = out.getSourceFiles()[0];
    expect(firstFile.getText()).to.eql('export let x: number = 4;');

    const checker = out.getTypeChecker();
    const sym = checker.getSymbolAtLocation(firstFile);
    if (!sym) {
      throw new Error('No symbol for source file');
    }
    const { exports } = sym;
    if (!exports) {
      throw new Error('No exports from source file');
    }
    expect(exports.size).to.be.greaterThan(0);
  }
}
