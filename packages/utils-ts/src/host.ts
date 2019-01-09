/* eslint-disable no-undef */
import * as ts from 'typescript';

interface SysHost {
  readFileSync(filePath: string, encoding?: string): string | undefined;

  writeFileSync(filePath: string, contents: string): void;

  pathRelativeTo(a: string, relativeTo: string): string;

  combinePaths(...paths: string[]): string;

  normalizePath(path: string): string;

  createTempFolder(): {
    name: string;
    cleanup(): void;
  };

  createFolder(path: string): void;

  isFolder(path: string): boolean;

  isFile(path: string): boolean;

  removeFolderAndContents(path: string): Promise<void>;

  fileOrFolderExists(path: string): boolean;
}

export default SysHost;
