/* eslint-disable no-undef */
import * as ts from 'typescript';

interface SysHost {
  readFileSync(filePath: string, encoding?: string): string | undefined;

  writeFileSync(filePath: string, contents: string): void;

  directoryExists(dirPath: string): boolean;

  fileExists(filePath: string): boolean;

  pathRelativeTo(a: string, relativeTo: string): string;

  combinePaths(...paths: string[]): string;

  normalizePath(path: string): string;

  createTempFolder(): {
    name: string;
    cleanup(): void;
  };
}

export default SysHost;
