import {
  createProgramFromCodeString,
  generateModulePathNormalizer,
  PASSTHROUGH_MODULE_PATH_NORMALIZER,
  SysHost,
} from '@code-to-json/utils-ts';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as tmp from 'tmp';
import * as ts from 'typescript';
import { promisify } from 'util';
import Collector from '../../src/collector';
import { create as createQueue } from '../../src/processing-queue';

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

export function setupScenario(code: string) {
  const workspace = createProgramFromCodeString(code, 'ts');
  const { program } = workspace;
  const [sf] = program.getSourceFiles().filter(f => !f.isDeclarationFile);
  if (!sf) {
    throw new Error('No SourceFile module.ts found');
  }

  const checker = program.getTypeChecker();

  const queue = createQueue();
  const collector: Collector = {
    queue,
    pathNormalizer: PASSTHROUGH_MODULE_PATH_NORMALIZER,
    host: nodeHost,
    opts: {
      includeDeclarations: 'none',
      pathNormalizer: generateModulePathNormalizer(nodeHost, {
        path: 'foo/bar/baz',
        name: 'temp-project',
      }),
    },
  };
  return { program, checker, sf, collector };
}
