import { WalkerOutputData } from '@code-to-json/core';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { create } from '../../src/data-collector';
import formatSourceFile from '../../src/source-file';

@suite
class SourceFileFormatterTests {
  @test
  public async 'file without exports'() {
    const wo: WalkerOutputData = {
      symbols: {},
      types: {},
      nodes: {},
      declarations: {},
      sourceFiles: {
        'module.ts': {
          entity: 'sourceFile',
          moduleName: 'module',
          extension: 'ts',
          isDeclarationFile: false,
          pathInPackage: 'module',
          id: 'module.ts',
        },
      },
    };
    const fsf = formatSourceFile(
      wo,
      {
        entity: 'sourceFile',
        moduleName: 'module',
        isDeclarationFile: false,
        id: 'module.ts',
        extension: 'ts',
        pathInPackage: 'module',
      },
      create(),
    );
    expect(fsf).to.deep.eq({
      moduleName: 'module',
      extension: 'ts',
      pathInPackage: 'module',
      isDeclarationFile: false,
    });
  }

  @test
  public async 'file with exports'() {
    const wo: WalkerOutputData = {
      symbols: {
        '12345': {
          name: 'module.ts',
          entity: 'symbol',
          id: '12345',
        },
      },
      types: {},
      nodes: {},
      declarations: {},
      sourceFiles: {
        'module.ts': {
          entity: 'sourceFile',
          moduleName: 'module',
          isDeclarationFile: false,
          id: 'module.ts',
          pathInPackage: 'module',
          extension: 'ts',
          symbol: ['symbol', '12345'] as any,
        },
      },
    };
    const fsf = formatSourceFile(
      wo,
      {
        entity: 'sourceFile',
        moduleName: 'module',
        isDeclarationFile: false,
        id: 'module.ts',
        pathInPackage: 'module',
        extension: 'ts',
        symbol: ['symbol', '12345'] as any,
      },
      create(),
    );
    expect(fsf).to.deep.eq({
      pathInPackage: 'module',
      extension: 'ts',
      moduleName: 'module',
      isDeclarationFile: false,
      name: 'module',
    });
  }
}
