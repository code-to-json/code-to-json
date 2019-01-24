import { setupTestCase } from '@code-to-json/test-helpers';
import { nodeHost } from '@code-to-json/utils-node';
import { PASSTHROUGH_MODULE_PATH_NORMALIZER } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';
import * as ts from 'typescript';
import { SerializedSourceFile, SourceFileRef, SymbolRef } from '../src';
import { create as createQueue, ProcessResult } from '../src/processing-queue';
import serializeSourceFile from '../src/serializers/source-file';
import { Collector } from '../src/types/walker';
import WalkerConfig from '../src/walker/config';

@suite
export class SimpleSnapshotSmokeTests {
  protected program!: ts.Program;

  protected checker!: ts.TypeChecker;

  protected rootPath!: string;

  protected sourceFiles!: ReadonlyArray<ts.SourceFile>;

  protected data!: ProcessResult<string, any, {}, {}, SerializedSourceFile>;

  public async before(): Promise<void> {
    const { program, rootPath } = await setupTestCase(
      path.join(__dirname, '..', '..', '..', 'samples', 'js-single-file'),
      ['src/index.js'],
    );
    this.program = program;
    this.rootPath = rootPath;
    const checker = program.getTypeChecker();
    this.checker = checker;
    const queue = createQueue();
    const collector: Collector = {
      queue,
      host: nodeHost,
      cfg: new WalkerConfig({
        pathNormalizer: PASSTHROUGH_MODULE_PATH_NORMALIZER,
        includeDeclarations: 'none',
      }),
    };

    this.sourceFiles = program.getSourceFiles();
    this.sourceFiles.forEach(sf => queue.queue(sf, 'sourceFile'));
    const data = queue.process({
      mapType: (_ref, item) => checker.typeToString(item),
      mapSymbol: (_ref: SymbolRef, item: ts.Symbol) => item.getName(),
      mapSourceFile: (ref: SourceFileRef, item: ts.SourceFile) =>
        serializeSourceFile(item, checker, ref, collector),
    });
    this.data = data;
  }

  @test
  public async 'SourceFile serialization'(): Promise<void> {
    const indexFile = this.sourceFiles.filter(sf => !sf.isDeclarationFile)[0];
    expect(indexFile.fileName.replace(this.rootPath, ''))
      .to.contain('src')
      .to.contain('index.js');
    const { sourceFiles } = this.data;

    const [indexFileData] = Object.keys(sourceFiles)
      .filter(sf => !sourceFiles[sf].isDeclarationFile)
      .map(sf => sourceFiles[sf]);
    expect(Object.keys(indexFileData))
      .contains('id')
      .contains('entity')
      .contains('moduleName')
      .contains('originalFileName')
      .contains('pathInPackage')
      .contains('extension')
      .contains('symbol')
      .contains('isDeclarationFile');
  }
}
