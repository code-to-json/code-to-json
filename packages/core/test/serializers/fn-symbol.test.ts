import { createRef } from '@code-to-json/utils';
import { createProgramFromCodeString } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as ts from 'typescript';
import { create as createQueue } from '../../src/processing-queue';
import generateId from '../../src/processing-queue/generate-id';
import serializeSourceFile from '../../src/serializers/source-file';

function setupScenario(code: string) {
  const workspace = createProgramFromCodeString(code, 'ts');
  const { program } = workspace;
  const [sf] = program.getSourceFiles().filter(f => !f.isDeclarationFile);
  if (!sf) {
    throw new Error('No SourceFile module.ts found');
  }

  const checker = program.getTypeChecker();

  const q = createQueue();
  return { program, checker, sf, q };
}

@suite
class SymbolSerializtionTests {
  @test
  public async 'Function signature'(): Promise<void> {
    const { program, checker, sf, q } = setupScenario(
      'function add(a: number, b: number): number { return a + b; }',
    );
    const [fnSym] = checker.getSymbolsInScope(sf, ts.SymbolFlags.Function);
    if (!fnSym) {
      throw new Error('Function has no symbol');
    }
    const [fnDecl] = fnSym.declarations;
    expect(fnDecl.getText()).to.eql('function add(a: number, b: number): number { return a + b; }');

    const sfRef = createRef('sourceFile', generateId(sf));
    const serialized = serializeSourceFile(sf, checker, sfRef, q);
    expect(serialized).to.deep.eq({
      entity: 'sourceFile',
      fileName: 'module.ts',
      id: 'module.ts',
      isDeclarationFile: false,
    });
  }
}
