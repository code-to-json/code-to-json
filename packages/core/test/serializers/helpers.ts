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

const host: SysHost = {
  readFileSync: ts.sys.readFile,
  writeFileSync: ts.sys.writeFile,
  directoryExists: ts.sys.directoryExists,
  fileExists: ts.sys.fileExists,
  pathRelativeTo(from: string, to: string) {
    return path.relative(from, to);
  },
  combinePaths(...paths: string[]): string {
    return path.join(...paths);
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
