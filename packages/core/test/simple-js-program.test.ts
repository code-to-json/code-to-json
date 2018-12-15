import { setupTestCase } from '@code-to-json/test-helpers';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';
import * as snapshot from 'snap-shot-it';
import { Node, SourceFile, Symbol as Sym, Type } from 'typescript';
import { create as createQueue } from '../src/processing-queue';
import { NodeRef, SourceFileRef, SymbolRef, TypeRef } from '../src/processing-queue/ref';
import sourceFileSerializer, { SerializedSourceFile } from '../src/serializers/source-file';
import serializeSourceFile from '../src/serializers/source-file';

@suite
class TypeScriptFixturePrograms {
  @test
  // tslint:disable-next-line:typedef
  public async 'creation of a simple JS program'() {
    const { program } = await setupTestCase(
      path.join(__dirname, '..', '..', '..', 'samples', 'js-single-file'),
      ['src/index.js']
    );
    const sourceFiles = program.getSourceFiles();
    const declarationFiles = sourceFiles.filter(sf => sf.isDeclarationFile);
    const nonDeclarationFiles = sourceFiles.filter(sf => !sf.isDeclarationFile);
    const tsLibs = declarationFiles.filter(
      sf => sf.fileName.indexOf('node_modules/typescript/lib') > 0
    );
    const tsLibNames = tsLibs.map(
      sf =>
        `${sf.fileName.substring(
          sf.fileName.lastIndexOf('typescript/lib/') + 'typescript/lib/'.length
        )}`
    );

    snapshot(tsLibNames);

    expect(nonDeclarationFiles).to.be.lengthOf(1);

    expect(nonDeclarationFiles[0].fileName).to.contain('src/index.js');
  }

  @test
  public async 'snapshot of simple JS program'() {
    const { program, rootPath } = await setupTestCase(
      path.join(__dirname, '..', '..', '..', 'samples', 'js-single-file'),
      ['src/index.js']
    );
    const checker = program.getTypeChecker();
    const sourceFiles = program.getSourceFiles();
    const indexFile = sourceFiles.filter(sf => !sf.isDeclarationFile)[0];
    expect(indexFile.fileName.replace(rootPath, '')).to.eql('/src/index.js');

    const q = createQueue();
    sourceFiles.forEach(sf => {
      return q.queue(sf, 'sourceFile', checker);
    });
    const serializedFileNames: string[] = [];
    const { sourceFile: sourceFileData } = q.drain({
      handleType(ref: TypeRef, item: Type) {
        return checker.typeToString(item);
      },
      handleSymbol(ref: SymbolRef, item: Sym) {
        return item.getName();
      },
      handleSourceFile(ref: SourceFileRef, item: SourceFile): SerializedSourceFile {
        return serializeSourceFile(item, checker, ref, q);
      }
    });
    const indexFilePath = Object.keys(sourceFileData).filter(k => k.startsWith(rootPath))[0];
    const indexFileData = sourceFileData[indexFilePath];
    expect(Object.keys(indexFileData))
      .contains('id')
      .contains('entity')
      .contains('fileName')
      .contains('symbol')
      .contains('isDeclarationFile');
  }
}
