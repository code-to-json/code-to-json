import { walkProgram } from '@code-to-json/core';
import { formatWalkerOutput } from '@code-to-json/formatter';
import { setupTestCase } from '@code-to-json/test-helpers';
import { NODE_HOST } from '@code-to-json/utils-node';
import { Dict } from '@mike-north/types';
import { expect } from 'chai';
import { Program } from 'typescript';
import {
  LinkedFormattedOutputData,
  LinkedFormattedSourceFile,
  LinkedFormattedSymbol,
  LinkedFormattedType,
  linkFormatterData,
} from '../../src';

export default class SingleFileAcceptanceTestCase {
  protected cleanupFn!: () => void;

  protected rootPath!: string;

  protected program!: Program;

  protected codeString: string;

  protected data?: LinkedFormattedOutputData;

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
    const formattedOutput = formatWalkerOutput(walkerOutput);

    this.data = linkFormatterData(formattedOutput.data);
  }

  public get allTypes(): Dict<LinkedFormattedType> {
    return this.data ? this.data.types : {};
  }

  public get allSymbols(): Dict<LinkedFormattedSymbol> {
    return this.data ? this.data.symbols : {};
  }

  public sourceFile(): Readonly<LinkedFormattedSourceFile> {
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
