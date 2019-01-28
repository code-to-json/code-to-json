import { createRef } from '@code-to-json/utils';
import { createIdGenerator } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as ts from 'typescript';
import { RefRegistry, SourceFileRef } from '../../src';
import serializeSourceFile from '../../src/serializers/source-file';
import { setupScenario } from './helpers';

@suite
export class SymbolSerializtionTests {
  @test
  public async 'Function signature'(): Promise<void> {
    const { checker, sf, collector } = setupScenario(
      'function add(a: number, b: number): number { return a + b; }',
    );
    const [fnSym] = checker.getSymbolsInScope(sf, ts.SymbolFlags.Function);
    if (!fnSym) {
      throw new Error('Function has no symbol');
    }
    const [fnDecl] = fnSym.declarations;
    expect(fnDecl.getText()).to.eql('function add(a: number, b: number): number { return a + b; }');
    const generateId = createIdGenerator(checker);
    const sfRef: SourceFileRef = createRef<RefRegistry, 'sourceFile'>(
      'sourceFile',
      generateId(sf)[1],
    );
    const serialized = serializeSourceFile(sf, checker, sfRef, undefined, collector);
    expect(serialized).to.deep.eq({
      entity: 'sourceFile',
      extension: 'ts',
      id: 'F01m4wncynx9e',
      isDeclarationFile: false,
      moduleName: 'temp-project/module',
      originalFileName: 'module.ts',
      pathInPackage: 'module',
    });
  }
}
