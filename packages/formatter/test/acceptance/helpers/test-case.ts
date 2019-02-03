import { walkProgram } from '@code-to-json/core';
import { setupTestCase } from '@code-to-json/test-helpers';
import { nodeHost } from '@code-to-json/utils-node';
import { expect } from 'chai';
import { Program } from 'typescript';
import {
  FormattedSourceFile,
  FormattedSourceFileRef,
  FormattedSymbol,
  FormattedSymbolRef,
  FormattedType,
  FormattedTypeRef,
  FormatterOutputData,
  formatWalkerOutput,
} from '../../../src';
import {
  sanitizeFormattedSourceFile,
  sanitizeFormattedSymbol,
  sanitizeFormattedType,
} from './sanitize';
import resolveReference from './utils';

const STANDARD_REPLACERS = (rootPath: string) =>
  [[rootPath, '--ROOT PATH--']] as Array<[string | RegExp, string]>;

export default class SingleFileAcceptanceTestCase {
  protected cleanupFn!: () => void;

  protected rootPath!: string;

  protected program!: Program;

  protected codeString: string;

  protected data?: FormatterOutputData;

  constructor(codeString: string) {
    this.codeString = codeString;
  }

  public async run() {
    const { program, cleanup, rootPath } = await setupTestCase(
      {
        // tslint:disable-next-line:no-duplicate-string
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
    const walkerOutput = walkProgram(program, nodeHost);
    const formattedOutput = formatWalkerOutput(walkerOutput);
    const { types, symbols, sourceFiles } = formattedOutput.data;

    Object.keys(types).forEach(k =>
      sanitizeFormattedType(types[k], { replace: STANDARD_REPLACERS(rootPath) }),
    );
    Object.keys(symbols).forEach(k =>
      sanitizeFormattedSymbol(symbols[k], { replace: STANDARD_REPLACERS(rootPath) }),
    );
    Object.keys(sourceFiles).forEach(k =>
      sanitizeFormattedSourceFile(sourceFiles[k], { replace: STANDARD_REPLACERS(rootPath) }),
    );
    this.data = formattedOutput.data;
  }

  // public resolveReference(ref?: FormattedNodeRef): FormattedNode;
  public resolveReference(ref?: FormattedTypeRef): FormattedType;
  public resolveReference(ref?: FormattedSymbolRef): FormattedSymbol;
  public resolveReference(ref?: FormattedSourceFileRef): FormattedSourceFile;
  public resolveReference(
    ref?: FormattedSourceFileRef | FormattedSymbolRef | FormattedTypeRef,
  ): any {
    if (!this.data) {
      throw new Error('No data!');
    }
    if (!ref) {
      throw new Error('No reference');
    }
    return resolveReference(this.data, ref as any);
  }

  public sourceFile(): Readonly<FormattedSourceFile> {
    if (!this.data) {
      throw new Error('No data!');
    }
    const { sourceFiles } = this.data;
    const fileIds = Object.keys(sourceFiles).filter(
      sfName => !sourceFiles[sfName].isDeclarationFile,
    );
    expect(fileIds).to.have.lengthOf(1, 'One source file');
    const file = sourceFiles[fileIds[0]];
    if (!file) {
      throw new Error('File is not defined!');
    }
    return file;
  }

  public cleanup() {
    if (this.cleanupFn) {
      this.cleanupFn();
    }
  }
}
