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

function transpileModule(input: string, options: ts.CompilerOptions): TranspileOuptut {
  const inputFileName = options.jsx ? 'module.tsx' : 'module.ts';
  const sourceFile = ts.createSourceFile(
    inputFileName,
    input,
    options.target || ts.ScriptTarget.ES5,
  );
  return new TranspileOuptutData(inputFileName, sourceFile, options);
}

export function transpileTsString(input: string): TranspileOuptut {
  return transpileModule(input, STD_COMPILER_OPTIONS);
}
