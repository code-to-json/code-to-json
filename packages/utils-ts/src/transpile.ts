import { UnreachableError } from '@code-to-json/utils';
import * as ts from 'typescript';

export interface TranspileOuptut {
  program: ts.Program;
  output: string;
}

const STD_COMPILER_OPTIONS: ts.CompilerOptions = {
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES5,
  noLib: true,
  noResolve: true,
  checkJs: true,
  allowJs: true,
  suppressOutputPathCheck: true,
};

class TranspileOuptutData implements TranspileOuptut {
  public program: ts.Program;

  private outputText: string = '';

  constructor(inputFileName: string, sourceFile: ts.SourceFile, options: ts.CompilerOptions) {
    const self = this;
    this.program = ts.createProgram([inputFileName], options, {
      getSourceFile(fileName): ts.SourceFile | undefined {
        return fileName.indexOf('module') === 0 ? sourceFile : undefined;
      },
      writeFile(_name, text): void {
        self.outputText = text;
      },
      getDefaultLibFileName(): string {
        return 'lib.d.ts';
      },
      useCaseSensitiveFileNames(): boolean {
        return false;
      },
      getCanonicalFileName(fileName: string): string {
        return fileName;
      },
      getCurrentDirectory(): string {
        return '';
      },
      getNewLine(): string {
        return '\r\n';
      },
      fileExists(fileName): boolean {
        return fileName === inputFileName;
      },
      readFile(): string {
        return '';
      },
      directoryExists(): boolean {
        return true;
      },
      getDirectories(): string[] {
        return [];
      },
    });
  }

  public get output(): string {
    return this.outputText;
  }
}

function transpileModule(
  input: string,
  inputFileName: string,
  scriptKind: ts.ScriptKind,
  options: ts.CompilerOptions,
): TranspileOuptut {
  const sourceFile = ts.createSourceFile(
    inputFileName,
    input,
    options.target || ts.ScriptTarget.ES5,
  );
  return new TranspileOuptutData(inputFileName, sourceFile, options);
}

function determineFileExtension(codeType: 'ts' | 'js'): string {
  return codeType;
}

function determineScriptKind(codeType: 'ts' | 'js', options: ts.CompilerOptions): ts.ScriptKind {
  const isJsx = !!options.jsx;
  switch (codeType) {
    case 'ts':
      return isJsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    case 'js':
      return isJsx ? ts.ScriptKind.JSX : ts.ScriptKind.JS;
    default:
      throw new UnreachableError(codeType);
  }
}

export type SupportedCompilerOptions = Pick<ts.CompilerOptions, 'target' | 'jsx' | 'module'>;

export function transpileCodeString(
  input: string,
  codeType: 'ts' | 'js',
  options: Partial<SupportedCompilerOptions> = {},
): TranspileOuptut {
  const opts: ts.CompilerOptions = { ...options, ...STD_COMPILER_OPTIONS };
  const scriptKind: ts.ScriptKind = determineScriptKind(codeType, opts);
  return transpileModule(
    input,
    `module.${determineFileExtension(codeType)}${opts.jsx ? 'x' : ''}`,
    scriptKind,
    opts,
  );
}
