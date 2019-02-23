import { createTempFixtureFolder, TestCaseFolder } from '@code-to-json/test-helpers';
import { expect } from 'chai';
import { existsSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';
import * as ts from 'typescript';
import { createProgramFromCodeString, createProgramFromTsConfig, SysHost } from '../src/index';
import { nodeHost } from './helpers';

const DEFAULT_FILE_EXISTENCE_CHECKER: (fileName: string) => boolean = f =>
  existsSync(f) && statSync(f).isFile();

const TEST_FILE_UTILS: [SysHost] = [nodeHost];

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

async function makeWorkspace(): Promise<TestCaseFolder> {
  const workspace = await createTempFixtureFolder({
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        allowJs: true,
        checkJs: true,
        target: 'ES2017',
        noEmit: true,
      },
    }),
    src: {
      'index.ts': "const x: string = 'foo';",
      'other.ts': "const y: string = 'bar';",
      'more.js': "const z = 'baz';",
    },
  });
  return workspace;
}

@suite('String to TypeScript program tests')
export class TranspileProgramTest {
  @test
  public 'simple valid ts program'(): void {
    const code = `export let x: number = 4;

    export function addToX(y: number): number { return x + y; }`;
    const out = createProgramFromCodeString(code, 'ts');
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
    const out = createProgramFromCodeString(code, 'js');
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
  public 'simple valid jsx program'(): void {
    const code = `export let x = <span>4</span>;`;
    const out = createProgramFromCodeString(code, 'js', { jsx: ts.JsxEmit.React });
    const sourceFileNames = out.program.getSourceFiles().map(sf => sf.fileName);
    expect(sourceFileNames.length).to.eql(1);
    expect(sourceFileNames.join(',')).to.eql('module.jsx');

    const firstFile = out.program.getSourceFiles()[0];
    expect(firstFile.getText()).to.eql(code);

    assertNumExports(out.program, firstFile, 1);

    out.program.emit();
    expect(out.output.replace(/\r\n/g, '\n')).to.eql(
      `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.x = React.createElement("span", null, "4");
`,
    );
  }

  @test
  public 'simple valid tsx program'(): void {
    const code = `export const x = <span>4</span>;`;
    const out = createProgramFromCodeString(code, 'ts', { jsx: ts.JsxEmit.React });
    const sourceFileNames = out.program.getSourceFiles().map(sf => sf.fileName);
    expect(sourceFileNames.length).to.eql(1);
    expect(sourceFileNames.join(',')).to.eql('module.tsx');

    const firstFile = out.program.getSourceFiles()[0];
    expect(firstFile.getText()).to.eql(code);

    assertNumExports(out.program, firstFile, 1);

    out.program.emit();
    expect(out.output.replace(/\r\n/g, '\n')).to.eql(
      `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.x = React.createElement("span", null, "4");
`,
    );
  }

  @test
  public 'simple invalid ts program'(): void {
    const code = `export let x: number = 4;
    x = false;`;
    const out = createProgramFromCodeString(code, 'ts');
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
    const out = createProgramFromCodeString(code, 'js');
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

  @test
  public 'simple invalid jsx program'(): void {
    const code = `export let x = <span>4;
    x = false;`;
    const out = createProgramFromCodeString(code, 'js', { jsx: ts.JsxEmit.React });
    const sourceFileNames = out.program.getSourceFiles().map(sf => sf.fileName);
    expect(sourceFileNames.length).to.eql(1, 'one source file');
    expect(sourceFileNames.join(',')).to.eql('module.jsx');

    const firstFile = out.program.getSourceFiles()[0];
    expect(firstFile.getText()).to.eql(code);

    assertNumExports(out.program, firstFile, 1);

    expect(out.output).to.eql('', 'empty output before emit');
    out.program.emit();

    const syntacticErrors = out.program.getSyntacticDiagnostics(firstFile);
    expect(syntacticErrors.length).to.eql(2, 'two syntactic errors');
    expect(syntacticErrors[0].file.fileName).to.eql('module.jsx');
    expect(syntacticErrors[0].start).to.eql(16);
    expect(syntacticErrors[0].category).to.eql(ts.DiagnosticCategory.Error);
    expect(syntacticErrors[0].messageText).to.eql(
      "JSX element 'span' has no corresponding closing tag.",
    );

    expect(out.output.replace(/\r\n/g, '\n')).to.eql(`"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.x = React.createElement("span", null, "4; x = false;");
`);
  }

  @test
  public 'simple invalid tsx program'(): void {
    const code = `export let x = <div>4;
    x = false;`;
    const out = createProgramFromCodeString(code, 'ts', { jsx: ts.JsxEmit.React });
    const sourceFileNames = out.program.getSourceFiles().map(sf => sf.fileName);
    expect(sourceFileNames.length).to.eql(1, 'one source file');
    expect(sourceFileNames.join(',')).to.eql('module.tsx');

    const firstFile = out.program.getSourceFiles()[0];
    expect(firstFile.getText()).to.eql(code);

    assertNumExports(out.program, firstFile, 1);

    expect(out.output).to.eql('', 'empty output before emit');
    out.program.emit();

    const syntacticErrors = out.program.getSyntacticDiagnostics(firstFile);
    expect(syntacticErrors.length).to.eql(2, 'two syntactic errors');
    expect(syntacticErrors[0].file.fileName).to.eql('module.tsx');
    expect(syntacticErrors[0].start).to.eql(16);
    expect(syntacticErrors[0].category).to.eql(ts.DiagnosticCategory.Error);
    expect(syntacticErrors[0].messageText).to.eql(
      "JSX element 'div' has no corresponding closing tag.",
    );

    expect(out.output.replace(/\r\n/g, '\n')).to.eql(`"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.x = React.createElement("div", null, "4; x = false;");
`);
  }

  @test
  public async 'createProgramFromTsConfig - simple case'(): Promise<void> {
    const workspace = await makeWorkspace();

    const prog = await createProgramFromTsConfig(workspace.rootPath, ...TEST_FILE_UTILS);
    expect(!!prog).to.eql(true);
    expect(prog.getSourceFiles().filter(sf => !sf.isDeclarationFile).length).to.eql(3);
    expect(prog.getSourceFiles().length).to.be.greaterThan(3);
    workspace.cleanup();
  }

  @test
  public async 'createProgramFromTsConfig - missing config'(): Promise<void> {
    const workspace = await makeWorkspace();
    unlinkSync(path.join(workspace.rootPath, 'tsconfig.json'));

    await createProgramFromTsConfig(workspace.rootPath, ...TEST_FILE_UTILS)
      .then(() => {
        expect(false).to.eql(true);
      })
      .catch((err: Error) => {
        expect(err.message).to.contain('Could not find a tsconfig.json via path');
      });
    workspace.cleanup();
  }

  @test
  public async 'createProgramFromTsConfig - invalid config (non-json)'(): Promise<void> {
    const workspace = await makeWorkspace();
    writeFileSync(path.join(workspace.rootPath, 'tsconfig.json'), '---');

    await createProgramFromTsConfig(workspace.rootPath, ...TEST_FILE_UTILS)
      .then(() => {
        expect(false).to.eql(true);
      })
      .catch((err: Error) => {
        expect(err.message).to.contain('TSConfig error');
      });
    workspace.cleanup();
  }

  @test
  public async 'createProgramFromTsConfig - invalid config (invalid schema)'(): Promise<void> {
    const workspace = await makeWorkspace();
    writeFileSync(
      path.join(workspace.rootPath, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: 'foo',
      }),
    );

    await createProgramFromTsConfig(workspace.rootPath, ...TEST_FILE_UTILS)
      .then(() => {
        expect(false).to.eql(true);
      })
      .catch((err: Error) => {
        expect(err.message).to.contain('Detected errors while parsing tsconfig file');
      });
    workspace.cleanup();
  }

  @test
  public async tsConfigForPathTests(): Promise<void> {
    const workspace = await makeWorkspace();

    const pth = ts.findConfigFile(path.join(workspace.rootPath), DEFAULT_FILE_EXISTENCE_CHECKER);
    if (!pth) {
      throw new Error('No path to tsconfig');
    }
    expect(pth).to.contain('tsconfig.json');
    expect(existsSync(pth)).to.equal(true);
    workspace.cleanup();
  }
}
