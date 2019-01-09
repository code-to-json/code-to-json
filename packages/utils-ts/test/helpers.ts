import { SysHost } from '@code-to-json/utils-ts';
import * as path from 'path';
import * as tmp from 'tmp';
import * as ts from 'typescript';

export const nodeHost: SysHost = {
  readFileSync(filePath: string, encoding?: string): string | undefined {
    return ts.sys.readFile(filePath, encoding);
  },

  writeFileSync(filePath: string, contents: string): void {
    return ts.sys.writeFile(filePath, contents);
  },

  directoryExists(dirPath: string): boolean {
    return ts.sys.directoryExists(dirPath);
  },

  fileExists(filePath: string): boolean {
    return ts.sys.fileExists(filePath);
  },

  pathRelativeTo(from: string, to: string): string {
    return path.relative(from, to);
  },

  combinePaths(...paths: string[]): string {
    return path.join(...paths);
  },

  normalizePath(pth: string): string {
    return path.normalize(pth).replace(/\\/g, '/');
  },

  createTempFolder(): {
    name: string;
    cleanup(): void;
  } {
    const tempFolder = tmp.dirSync({ unsafeCleanup: true });
    return {
      name: tempFolder.name,
      cleanup(): void {
        tempFolder.removeCallback();
      },
    };
  },
};
