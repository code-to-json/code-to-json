import { setupTestCase } from '@code-to-json/test-helpers';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import * as path from 'path';
import * as snapshot from 'snap-shot-it';

@suite
class TypeScriptFixturePrograms {
  @test
  // tslint:disable-next-line:typedef
  public async createSimpleJSProgram() {
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
}
