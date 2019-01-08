import { setupTestCase } from '@code-to-json/test-helpers';
import { NodeHost } from '@code-to-json/utils-node';
import { generateId, PASSTHROUGH_MODULE_PATH_NORMALIZER } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';
import * as ts from 'typescript';
import Collector from '../src/collector';
import { create as createQueue, DrainOutput } from '../src/processing-queue';
import { SourceFileRef, SymbolRef, TypeRef } from '../src/processing-queue/ref';
import serializeSourceFile, { SerializedSourceFile } from '../src/serializers/source-file';

@suite
class SimpleSnapshotSmokeTests {
  protected program!: ts.Program;

  protected checker!: ts.TypeChecker;

  protected rootPath!: string;

  protected sourceFiles!: ReadonlyArray<ts.SourceFile>;

  protected data!: DrainOutput<string, any, {}, {}, SerializedSourceFile>;

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
      host: new NodeHost(),
      pathNormalizer: PASSTHROUGH_MODULE_PATH_NORMALIZER,
      opts: {
        pathNormalizer: PASSTHROUGH_MODULE_PATH_NORMALIZER,
        includeDeclarations: 'none',
      },
    };

    this.sourceFiles = program.getSourceFiles();
    this.sourceFiles.forEach(sf => queue.queue(sf, 'sourceFile', this.checker));
    const data = queue.drain({
      handleType(_ref: TypeRef, item: ts.Type): string {
        return checker.typeToString(item);
      },
      handleSymbol(_ref: SymbolRef, item: ts.Symbol): string {
        return item.getName();
      },
      handleSourceFile(ref: SourceFileRef, item: ts.SourceFile): SerializedSourceFile {
        return serializeSourceFile(item, checker, ref, collector);
      },
    });
    this.data = data;
  }

  @test
  public async 'SourceFile serialization'(): Promise<void> {
    const indexFile = this.sourceFiles.filter(sf => !sf.isDeclarationFile)[0];
    expect(indexFile.fileName.replace(this.rootPath, ''))
      .to.contain('src')
      .to.contain('index.js');
    const { sourceFile: sourceFileData } = this.data;

    const indexFileId = generateId(indexFile);
    const indexFileData = sourceFileData[indexFileId];
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
