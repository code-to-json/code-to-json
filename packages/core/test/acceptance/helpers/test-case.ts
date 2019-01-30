import { setupTestCase } from '@code-to-json/test-helpers';
import { nodeHost } from '@code-to-json/utils-node';
import { Dict } from '@mike-north/types';
import { expect } from 'chai';
import { Program } from 'typescript';
import {
  NodeRef,
  SerializedNode,
  SerializedSourceFile,
  SerializedSymbol,
  SerializedType,
  SourceFileRef,
  SymbolRef,
  TypeRef,
  WalkerOutputData,
  walkProgram,
} from '../../../src';
import { sanitizeSourceFile, sanitizeSymbol, sanitizeType } from './sanitize';
import resolveReference from './utils';

const STANDARD_REPLACERS = (rootPath: string) =>
  [[rootPath, '--ROOT PATH--']] as Array<[string | RegExp, string]>;

export default class SingleFileAcceptanceTestCase {
  protected cleanupFn!: () => void;

  protected rootPath!: string;

  protected program!: Program;

  protected codeString: string;

  protected data?: WalkerOutputData;

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
    this.data = walkerOutput.data;
  }

  public resolveReference(ref?: NodeRef): SerializedNode;
  public resolveReference(ref?: TypeRef): SerializedType;
  public resolveReference(ref?: SymbolRef): SerializedSymbol;
  public resolveReference(ref?: SourceFileRef): SerializedSourceFile;
  public resolveReference(ref?: SourceFileRef | SymbolRef | NodeRef | TypeRef): any {
    if (!this.data) {
      throw new Error('No data!');
    }
    if (!ref) {
      throw new Error('No reference');
    }
    return resolveReference(this.data, ref as any);
  }

  public get allTypes(): Dict<SerializedType> {
    return this.data ? this.data.types : {};
  }

  public get allSymbols(): Dict<SerializedSymbol> {
    return this.data ? this.data.symbols : {};
  }

  public sourceFile(): Readonly<SerializedSourceFile> {
    if (!this.data) {
      throw new Error('No data!');
    }
    const { sourceFiles } = this.data;
    const fileIds = Object.keys(sourceFiles);
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
