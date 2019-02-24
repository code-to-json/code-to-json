import { setupTestCase } from '@code-to-json/test-helpers';
import { NODE_HOST } from '@code-to-json/utils-node';
import { PASSTHROUGH_REVERSE_RESOLVER } from '@code-to-json/utils-ts';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import * as path from 'path';
import * as ts from 'typescript';
import { SerializedSourceFile, SourceFileRef, SymbolRef } from '../src';
import { create as createQueue, ProcessResult } from '../src/processing-queue';
import serializeSourceFile from '../src/serializers/source-file';
import { Collector } from '../src/types/walker';
import WalkerConfig from '../src/walker/config';

describe('Snapshot smoke tests', () => {
  let program: ts.Program;

  let checker: ts.TypeChecker;

  let rootPath: string;

  let sourceFiles: ReadonlyArray<ts.SourceFile>;

  let data: ProcessResult<string, any, {}, {}, SerializedSourceFile>;

  before(async () => {
    const { program: _program, rootPath: _rootPath } = await setupTestCase(
      path.join(__dirname, '..', '..', '..', 'samples', 'js-single-file'),
      ['src/index.js'],
    );
    program = _program;
    rootPath = _rootPath;
    checker = program.getTypeChecker();
    const queue = createQueue(checker);
    const collector: Collector = {
      queue,
      host: NODE_HOST,
      cfg: new WalkerConfig({
        pathNormalizer: PASSTHROUGH_REVERSE_RESOLVER,
        includeDeclarations: 'none',
      }),
    };

    sourceFiles = program.getSourceFiles();
    sourceFiles.forEach(sf => queue.queue(sf, 'sourceFile'));
    const _data = queue.process({
      mapType: (_ref, item) => checker.typeToString(item),
      mapSymbol: (_ref: SymbolRef, item: ts.Symbol) => item.getName(),
      mapSourceFile: (ref: SourceFileRef, item: ts.SourceFile) =>
        serializeSourceFile(item, checker, ref, undefined, collector),
    });
    data = _data;
  });

  it('SourceFile serialization', async () => {
    const indexFile = sourceFiles.filter(sf => !sf.isDeclarationFile)[0];
    expect(indexFile.fileName.replace(rootPath, ''))
      .to.contain('src')
      .to.contain('index.js');
    const { sourceFiles: mySourceFiles } = data;

    const [indexFileData] = Object.keys(mySourceFiles)
      .filter(sf => !mySourceFiles[sf].isDeclarationFile)
      .map(sf => mySourceFiles[sf]);
    expect(Object.keys(indexFileData))
      .contains('id')
      .contains('entity')
      .contains('moduleName')
      .contains('originalFileName')
      .contains('pathInPackage')
      .contains('extension')
      .contains('symbol')
      .contains('isDeclarationFile');
  });
});
