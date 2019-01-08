/* eslint-disable import/prefer-default-export */
import {
  createProgramFromCodeString,
  generateModulePathNormalizer,
  PASSTHROUGH_MODULE_PATH_NORMALIZER,
  SysHost,
} from '@code-to-json/utils-ts';
import * as path from 'path';
import * as ts from 'typescript';
import Collector from '../../src/collector';
import { create as createQueue } from '../../src/processing-queue';

export class NodeHost extends SysHost {
  public readFileSync(filePath: string, encoding?: string): string | undefined {
    return ts.sys.readFile(filePath, encoding);
  }

  public writeFileSync(filePath: string, contents: string): void {
    return ts.sys.writeFile(filePath, contents);
  }

  public directoryExists(dirPath: string): boolean {
    return ts.sys.directoryExists(dirPath);
  }

  public fileExists(filePath: string): boolean {
    return ts.sys.fileExists(filePath);
  }

  public pathRelativeTo(from: string, to: string): string {
    return path.relative(from, to);
  }

  public combinePaths(...paths: string[]): string {
    return path.join(...paths);
  }

  public normalizePath(pth: string): string {
    return path.normalize(pth).replace(/\\/g, '/');
  }
}

const host = new NodeHost();

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
    host,
    opts: {
      includeDeclarations: 'none',
      pathNormalizer: generateModulePathNormalizer(host, {
        path: 'foo/bar/baz',
        name: 'temp-project',
      }),
    },
  };
  return { program, checker, sf, collector };
}
