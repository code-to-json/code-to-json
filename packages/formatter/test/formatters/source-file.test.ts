import { WalkerOutputData } from '@code-to-json/core';
import { createRef } from '@code-to-json/utils';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { FormatterRefRegistry } from '../../src';
import { create } from '../../src/data-collector';
import formatSourceFile from '../../src/source-file';

@suite
export class SourceFileFormatterTests {
  @test
  public async 'file without exports'(): Promise<void> {
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
      createRef<FormatterRefRegistry, 'f'>('f', 'module.ts'),
      create(),
    );
    expect(fsf).to.deep.eq({
      id: 'module.ts',
      moduleName: 'module',
      extension: 'ts',
      path: 'module.ts',
      kind: 'sourceFile',
      isDeclarationFile: false,
    });
  }

  @test
  public async 'file with exports'(): Promise<void> {
    const wo: WalkerOutputData = {
      symbols: {
        12345: {
          name: 'module.ts',
          entity: 'symbol',
          id: '12345',
          text: 'a stringified module',
          flags: ['module'],
        },
      },
      types: {},
      nodes: {},
      declarations: {},
      sourceFiles: {
        'module.ts': {
          entity: 'sourceFile',
          moduleName: 'module',
          id: 'module.ts',
          isDeclarationFile: false,
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
      createRef<FormatterRefRegistry, 'f'>('f', 'module.ts'),
      create(),
    );
    expect(fsf).to.deep.eq({
      id: 'module.ts',
      path: 'module.ts',
      extension: 'ts',
      symbol: ['s', '12345'],
      moduleName: 'module',
      isDeclarationFile: false,
      kind: 'sourceFile',
    });
  }
}
