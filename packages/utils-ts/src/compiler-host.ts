/* eslint-disable class-methods-use-this, no-empty-function, no-useless-constructor */

import * as ts from 'typescript';
import SysHost from './host';
import * as _ts from './ts-internal';

/**
 * Return code of ts.sys.readFile when the file encoding is unsupported.
 */
const ERROR_UNSUPPORTED_FILE_ENCODING = -2147024809;

class CompilerHost implements ts.CompilerHost {
  private currentDirectory?: string;

  constructor(protected h: SysHost) {}

  /**
   * Return an instance of ts.SourceFile representing the given file.
   *
   * Implementation of ts.CompilerHost.getSourceFile()
   *
   * @param filename  The path and name of the file that should be loaded.
   * @param languageVersion  The script target the file should be interpreted with.
   * @param onError  A callback that will be invoked if an error occurs.
   * @returns An instance of ts.SourceFile representing the given file.
   *
   * @note
   * originally obtained from (Apache-2):
   * https://github.com/TypeStrong/typedoc/blob/90f7046607f47c44cd8747f9b9d47548cb35d55d/src/lib/converter/utils/compiler-host.ts#L31-L43
   */
  public getSourceFile(
    filename: string,
    languageVersion: ts.ScriptTarget,
    onError?: (message: string) => void,
  ): ts.SourceFile | undefined {
    let text: string | undefined;
    try {
      text = this.h.readFileSync(filename);
    } catch (e) {
      if (onError) {
        onError(
          e.number === ERROR_UNSUPPORTED_FILE_ENCODING ? 'Unsupported file encoding' : e.message,
        );
      }
      text = '';
    }

    return text !== undefined ? ts.createSourceFile(filename, text, languageVersion) : undefined;
  }

  /**
   * Return the full path of the default library that should be used.
   *
   * Implementation of ts.CompilerHost.getDefaultLibFilename()
   *
   * @returns The full path of the default library.
   */
  public getDefaultLibFileName(options: ts.CompilerOptions): string {
    const libLocation = _ts.getDirectoryPath(_ts.normalizePath(ts.sys.getExecutingFilePath()));
    return _ts.combinePaths(libLocation, ts.getDefaultLibFileName(options));
  }

  public getDirectories(path: string): string[] {
    return ts.sys.getDirectories(path);
  }

  /**
   * Return the full path of the current directory.
   *
   * Implementation of ts.CompilerHost.getCurrentDirectory()
   *
   * @returns The full path of the current directory.
   */
  public getCurrentDirectory(): string {
    if (!this.currentDirectory) {
      this.currentDirectory = ts.sys.getCurrentDirectory();
    }
    return this.currentDirectory;
  }

  /**
   * Return whether file names are case sensitive on the current platform or not.
   *
   * Implementation of ts.CompilerHost.useCaseSensitiveFileNames()
   *
   * @returns TRUE if file names are case sensitive on the current platform, FALSE otherwise.
   */
  public useCaseSensitiveFileNames(): boolean {
    return ts.sys.useCaseSensitiveFileNames;
  }

  /**
   * Check whether the given file exists.
   *
   * Implementation of ts.CompilerHost.fileExists(fileName)
   *
   * @param fileName
   * @returns {boolean}
   */
  public fileExists(fileName: string): boolean {
    return this.h.fileOrFolderExists(fileName);
  }

  /**
   * Check whether the given directory exists.
   *
   * Implementation of ts.CompilerHost.directoryExists(directoryName)
   *
   * @param directoryName
   * @returns {boolean}
   */
  public directoryExists(directoryName: string): boolean {
    return this.h.fileOrFolderExists(directoryName);
  }

  /**
   * Return the contents of the given file.
   *
   * Implementation of ts.CompilerHost.readFile(fileName)
   *
   * @param fileName
   * @returns {string}
   */
  public readFile(fileName: string): string | undefined {
    return ts.sys.readFile(fileName);
  }

  /**
   * Return the canonical file name of the given file.
   *
   * Implementation of ts.CompilerHost.getCanonicalFileName()
   *
   * @param fileName  The file name whose canonical variant should be resolved.
   * @returns The canonical file name of the given file.
   */
  public getCanonicalFileName(fileName: string): string {
    return ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
  }

  /**
   * Return the new line char sequence of the current platform.
   *
   * Implementation of ts.CompilerHost.getNewLine()
   *
   * @returns The new line char sequence of the current platform.
   */
  public getNewLine(): string {
    return ts.sys.newLine;
  }

  /**
   * Write a compiled javascript file to disc.
   *
   * As code-to-json will not emit compiled javascript files this is a null operation.
   *
   * Implementation of ts.CompilerHost.writeFile()
   *
   * @param fileName  The name of the file that should be written.
   * @param data  The contents of the file.
   * @param writeByteOrderMark  Whether the UTF-8 BOM should be written or not.
   * @param onError  A callback that will be invoked if an error occurs.
   */
  // tslint:disable-next-line:typedef
  public writeFile(
    _fileName: string,
    _data: string,
    _writeByteOrderMark: boolean,
    _onError?: (message: string) => void,
    // tslint:disable-next-line:no-empty
  ) {}
}

export default CompilerHost;
