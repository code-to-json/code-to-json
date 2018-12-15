import { setupTestCase } from '@code-to-json/test-helpers';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';
import * as ts from 'typescript';
import { SourceFile, Symbol as Sym, Type } from 'typescript';
import { create as createQueue, DrainOutput } from '../src/processing-queue';
import { SourceFileRef, SymbolRef, TypeRef } from '../src/processing-queue/ref';
import { SerializedSourceFile } from '../src/serializers/source-file';
import serializeSourceFile from '../src/serializers/source-file';

@suite
class SimpleSnapshotSmokeTests {
  protected program!: ts.Program;
  protected checker!: ts.TypeChecker;
  protected rootPath!: string;
  protected sourceFiles!: ReadonlyArray<SourceFile>;
  protected data!: DrainOutput<string, any, {}, {}, SerializedSourceFile>;

  public async before(): Promise<void> {
    const { program, rootPath } = await setupTestCase(
      path.join(__dirname, '..', '..', '..', 'samples', 'js-single-file'),
      ['src/index.js']
    );
    this.program = program;
    this.rootPath = rootPath;
    const checker = (this.checker = program.getTypeChecker());
    const q = createQueue();
    this.sourceFiles = program.getSourceFiles();
    this.sourceFiles.forEach(sf => {
      return q.queue(sf, 'sourceFile', this.checker);
    });
    const data = q.drain({
      handleType(_ref: TypeRef, item: Type): string {
        return checker.typeToString(item);
      },
      handleSymbol(_ref: SymbolRef, item: Sym): string {
        return item.getName();
      },
      handleSourceFile(ref: SourceFileRef, item: SourceFile): SerializedSourceFile {
        return serializeSourceFile(item, checker, ref, q);
      }
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
    const indexFilePath = this.sourceFiles
      .filter(sf => !sf.isDeclarationFile)
      .map(sf => sf.fileName)[0];

    const indexFileData = sourceFileData[indexFilePath];
    expect(Object.keys(indexFileData))
      .contains('id')
      .contains('entity')
      .contains('fileName')
      .contains('symbol')
      .contains('isDeclarationFile');
  }
}
