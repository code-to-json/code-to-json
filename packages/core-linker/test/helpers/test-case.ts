import { walkProgram } from '@code-to-json/core';
import { setupTestCase } from '@code-to-json/test-helpers';
import { NODE_HOST } from '@code-to-json/utils-node';
import { Dict } from '@mike-north/types';
import { expect } from 'chai';
import { Program } from 'typescript';
import {
  LinkedSourceFile,
  LinkedSymbol,
  LinkedType,
  LinkedWalkerOutputData,
  linkWalkerOutputData,
} from '../../src';
import { sanitizeSourceFile, sanitizeSymbol, sanitizeType } from './sanitize';

const STANDARD_REPLACERS = (rootPath: string) =>
  [[rootPath, '--ROOT PATH--']] as Array<[string | RegExp, string]>;

export default class SingleFileAcceptanceTestCase {
  protected cleanupFn!: () => void;

  protected rootPath!: string;

  protected program!: Program;

  protected codeString: string;

  protected data?: LinkedWalkerOutputData;

  constructor(codeString: string) {
    this.codeString = codeString;
  }

  public async run(): Promise<void> {
    const { program, cleanup, rootPath } = await setupTestCase(
      {
        src: { 'index.ts': this.codeString },
        'package.json': JSON.stringify({
          name: 'pkg-ts-single-file',
          'doc:main': 'src/index.ts',
        }),
        'tsconfig.json': JSON.stringify({
          compilerOptions: {
            target: 'es2017',
            moduleResolution: 'node',
            noEmit: true,
          },
          include: ['./src/**/*'],
        }),
      },
      ['src/index.ts'],
    );
    this.rootPath = rootPath;
    this.cleanupFn = cleanup;
    const walkerOutput = walkProgram(program, NODE_HOST);
    const { types, symbols, sourceFiles } = walkerOutput.data;

    Object.keys(types).forEach(k =>
      sanitizeType(types[k], { replace: STANDARD_REPLACERS(rootPath) }),
    );
    Object.keys(symbols).forEach(k =>
      sanitizeSymbol(symbols[k], { replace: STANDARD_REPLACERS(rootPath) }),
    );
    Object.keys(sourceFiles).forEach(k =>
      sanitizeSourceFile(sourceFiles[k], { replace: STANDARD_REPLACERS(rootPath) }),
    );
    this.data = linkWalkerOutputData(walkerOutput.data);
  }

  public get allTypes(): Dict<LinkedType> {
    return this.data ? this.data.types : {};
  }

  public get allSymbols(): Dict<LinkedSymbol> {
    return this.data ? this.data.symbols : {};
  }

  public sourceFile(): Readonly<LinkedSourceFile> {
    if (!this.data) {
      throw new Error('No data!');
    }
    const { sourceFiles } = this.data;
    const fileIds = Object.keys(sourceFiles).filter(
      sfName => !sourceFiles[sfName]!.isDeclarationFile,
    );
    expect(fileIds).to.have.lengthOf(1, 'One source file');
    const file = sourceFiles[fileIds[0]];
    if (!file) {
      throw new Error('File is not defined!');
    }
    return file;
  }

  public cleanup(): void {
    if (this.cleanupFn) {
      this.cleanupFn();
    }
  }
}
