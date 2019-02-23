import { FixtureFolder, flattenFixtureFolder, setupTestCase } from '@code-to-json/test-helpers';
import { isDefined } from '@code-to-json/utils';
import { NODE_HOST } from '@code-to-json/utils-node';
import { Dict } from '@mike-north/types';
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

export class MultiFileAcceptanceTestCase {
  protected cleanupFn!: () => void;

  protected rootPath!: string;

  protected program!: Program;

  protected data?: WalkerOutputData;

  protected projectName = 'test-pkg';

  constructor(
    protected fixture: FixtureFolder,
    protected options: {
      main: string;
    } = {
      main: 'src/index.ts',
    },
  ) {}

  public async run(): Promise<void> {
    const flattenedFixture = flattenFixtureFolder(this.fixture);
    const entries = Object.keys(flattenedFixture).map(s => NODE_HOST.combinePaths('src', s));
    const testCaseFiles: FixtureFolder = {
      src: this.fixture,
      'package.json': JSON.stringify({
        name: this.projectName,
        'doc:main': this.options.main,
      }),
      'tsconfig.json': JSON.stringify({
        compilerOptions: {
          target: 'es2017',
          moduleResolution: 'node',
          noEmit: true,
        },
        include: entries,
      }),
    };
    const { program, cleanup, rootPath } = await setupTestCase(testCaseFiles, entries);
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
    this.data = walkerOutput.data;
  }

  public resolveReference(ref?: NodeRef): SerializedNode;
  public resolveReference(ref?: TypeRef): SerializedType;
  public resolveReference(ref?: SymbolRef): SerializedSymbol;
  public resolveReference(ref?: SourceFileRef): SerializedSourceFile;
  public resolveReference(ref?: any): any {
    if (!this.data) {
      throw new Error('No data!');
    }
    if (!ref) {
      throw new Error('No reference');
    }
    return resolveReference(this.data, ref);
  }

  public get allTypes(): Dict<SerializedType> {
    return this.data ? this.data.types : {};
  }

  public get allSymbols(): Dict<SerializedSymbol> {
    return this.data ? this.data.symbols : {};
  }

  public sourceFiles(): ReadonlyArray<SerializedSourceFile> {
    if (!this.data) {
      throw new Error('No data!');
    }
    const { sourceFiles } = this.data;
    const fileIds = Object.keys(sourceFiles).filter(
      sfName => !sourceFiles[sfName]!.isDeclarationFile,
    );

    return fileIds.map(fid => sourceFiles[fid]).filter(isDefined);
  }

  public cleanup(): void {
    if (this.cleanupFn) {
      this.cleanupFn();
    }
  }
}

export default class SingleFileAcceptanceTestCase extends MultiFileAcceptanceTestCase {
  constructor(codeString: string, fileExt: 'ts' | 'js' = 'ts') {
    super({
      [`index.${fileExt}`]: codeString,
    });
  }

  public sourceFile(): Readonly<SerializedSourceFile> {
    return this.sourceFiles()[0];
  }
}
