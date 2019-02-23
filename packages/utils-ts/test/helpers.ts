import { setupTestCase, TestCase } from '@code-to-json/test-helpers';
import { SysHost } from '@code-to-json/utils-ts';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as tmp from 'tmp';
import * as ts from 'typescript';
import { promisify } from 'util';

const primraf = promisify(rimraf);

export const nodeHost: SysHost = {
  readFileSync(filePath: string, encoding?: string): string | undefined {
    return ts.sys.readFile(filePath, encoding);
  },

  writeFileSync(filePath: string, contents: string): void {
    return ts.sys.writeFile(filePath, contents);
  },

  fileOrFolderExists(pth: string): boolean {
    return ts.sys.fileExists(pth) || ts.sys.directoryExists(pth);
  },

  isFile(pth: string): boolean {
    return fs.statSync(pth).isFile();
  },

  isFolder(pth: string): boolean {
    return fs.statSync(pth).isDirectory();
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

  createFolder(pth: string): void {
    fs.mkdirSync(pth, { recursive: true });
  },

  removeFolderAndContents(pth: string): Promise<void> {
    return primraf(pth);
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

export async function setupSingleModuleProgram(code: string): Promise<TestCase> {
  return setupTestCase(
    {
      src: { 'index.ts': code },
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
}
