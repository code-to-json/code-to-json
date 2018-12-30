import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as ts from 'typescript';
import { transpileTsString } from '../src/index';

@suite('String to TypeScript program tests')
class TranspileProgramTest {
  @test
  public 'simple valid program'(): void {
    const code = `export let x: number = 4;
  
    export function addToX(y: number): number { return x + y; }`;
    const out = transpileTsString(code);
    const sourceFileNames = out.program.getSourceFiles().map(sf => sf.fileName);
    expect(sourceFileNames.length).to.eql(1);
    expect(sourceFileNames.join(',')).to.eql('module.ts');

    const firstFile = out.program.getSourceFiles()[0];
    expect(firstFile.getText()).to.eql(code);

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
    expect(out.output.replace(/\r\n/g, '\n')).to.eql(
      `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.x = 4;
function addToX(y) { return exports.x + y; }
exports.addToX = addToX;
`,
    );
  }

  @test
  public 'simple invalid program'(): void {
    const code = `export let x: number = 4;
    x = false;`;
    const out = transpileTsString(code);
    const sourceFileNames = out.program.getSourceFiles().map(sf => sf.fileName);
    expect(sourceFileNames.length).to.eql(1);
    expect(sourceFileNames.join(',')).to.eql('module.ts');

    const firstFile = out.program.getSourceFiles()[0];
    expect(firstFile.getText()).to.eql(code);

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
    const semanticErrors = out.program.getSemanticDiagnostics();
    expect(semanticErrors.length).to.eql(1);
    expect((semanticErrors[0].file as ts.SourceFile).fileName).to.eql('module.ts');
    expect(semanticErrors[0].start).to.eql(30);
    expect(semanticErrors[0].category).to.eql(ts.DiagnosticCategory.Error);
    expect(semanticErrors[0].messageText).to.eql(
      "Type 'false' is not assignable to type 'number'.",
    );
    expect(out.output.replace(/\r\n/g, '\n')).to.eql(
      `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.x = 4;
exports.x = false;
`,
    );
  }
}
