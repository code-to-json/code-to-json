import { CompilerOptions, createProgram, Program, SourceFile } from 'typescript';
import TranspileOuptut from './transpile-output';

export default class TranspileOuptutData implements TranspileOuptut {
  public program: Program;

  private outputText: string = '';

  constructor(inputFileName: string, sourceFile: SourceFile, options: CompilerOptions) {
    const self = this;
    this.program = createProgram([inputFileName], options, {
      getSourceFile(fileName): SourceFile | undefined {
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
