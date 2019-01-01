import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as ts from 'typescript';
import { transpileCodeString } from '../src/index';

function assertNumExports(
  prog: ts.Program,
  file: ts.SourceFile,
  n: number,
  message: string = `${file.fileName} should have ${n} exported symbols`,
): void {
  const checker = prog.getTypeChecker();
  const sym = checker.getSymbolAtLocation(file);
  if (!sym) {
    throw new Error('No symbol for source file');
  }
  const { exports } = sym;
  if (!exports) {
    throw new Error('No exports from source file');
  }
  expect(exports.size).to.eql(n, message);
}

@suite('String to TypeScript program tests')
class TranspileProgramTest {
  @test
  public 'simple valid ts program'(): void {
    const code = `export let x: number = 4;
  
    export function addToX(y: number): number { return x + y; }`;
    const out = transpileCodeString(code, 'ts');
    const sourceFileNames = out.program.getSourceFiles().map(sf => sf.fileName);
    expect(sourceFileNames.length).to.eql(1);
    expect(sourceFileNames.join(',')).to.eql('module.ts');

    const firstFile = out.program.getSourceFiles()[0];
    assertNumExports(out.program, firstFile, 2);

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
  public 'simple valid js program'(): void {
    const code = `export let x = 4;
  
    export function addToX(y) { return x + y; }`;
    const out = transpileCodeString(code, 'js');
    const sourceFileNames = out.program.getSourceFiles().map(sf => sf.fileName);
    expect(sourceFileNames.length).to.eql(1);
    expect(sourceFileNames.join(',')).to.eql('module.js');

    const firstFile = out.program.getSourceFiles()[0];
    expect(firstFile.getText()).to.eql(code);

    assertNumExports(out.program, firstFile, 2);

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
  public 'simple invalid ts program'(): void {
    const code = `export let x: number = 4;
    x = false;`;
    const out = transpileCodeString(code, 'ts');
    const sourceFileNames = out.program.getSourceFiles().map(sf => sf.fileName);
    expect(sourceFileNames.length).to.eql(1);
    expect(sourceFileNames.join(',')).to.eql('module.ts');

    const firstFile = out.program.getSourceFiles()[0];
    expect(firstFile.getText()).to.eql(code);
    assertNumExports(out.program, firstFile, 1);

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

  @test
  public 'simple invalid js program'(): void {
    const code = `export let x: number = 4;
    x = false;`;
    const out = transpileCodeString(code, 'js');
    const sourceFileNames = out.program.getSourceFiles().map(sf => sf.fileName);
    expect(sourceFileNames.length).to.eql(1, 'one source file');
    expect(sourceFileNames.join(',')).to.eql('module.js');

    const firstFile = out.program.getSourceFiles()[0];
    expect(firstFile.getText()).to.eql(code);

    assertNumExports(out.program, firstFile, 1);

    expect(out.output).to.eql('', 'empty output before emit');
    out.program.emit();

    const syntacticErrors = out.program.getSyntacticDiagnostics(firstFile);
    expect(syntacticErrors.length).to.eql(1, 'at least one syntactic error');
    expect(syntacticErrors[0].file.fileName).to.eql('module.js');
    expect(syntacticErrors[0].start).to.eql(14);
    expect(syntacticErrors[0].category).to.eql(ts.DiagnosticCategory.Error);
    expect(syntacticErrors[0].messageText).to.eql("'types' can only be used in a .ts file.");

    const semanticErrors = out.program.getSemanticDiagnostics();
    expect(semanticErrors.length).to.eql(1, 'at least one semantic error');
    expect((semanticErrors[0].file as ts.SourceFile).fileName).to.eql('module.js');
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
