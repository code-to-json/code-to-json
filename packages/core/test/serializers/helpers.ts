import { NODE_HOST } from '@code-to-json/utils-node';
import { createProgramFromCodeString, createReverseResolver } from '@code-to-json/utils-ts';
import * as ts from 'typescript';
import { create as createQueue } from '../../src/processing-queue';
import { Collector } from '../../src/types/walker';
import WalkerConfig from '../../src/walker/config';

export function setupScenario(
  code: string,
): {
  program: ts.Program;
  checker: ts.TypeChecker;
  sf: ts.SourceFile;
  collector: Collector;
} {
  const workspace = createProgramFromCodeString(code, 'ts');
  const { program } = workspace;
  const [sf] = program.getSourceFiles().filter((f) => !f.isDeclarationFile);
  if (!sf) {
    throw new Error('No SourceFile module.ts found');
  }

  const checker = program.getTypeChecker();

  const queue = createQueue(checker);
  const collector: Collector = {
    queue,
    host: NODE_HOST,
    cfg: new WalkerConfig({
      includeDeclarations: 'none',
      pathNormalizer: createReverseResolver(NODE_HOST, {
        path: '.',
        name: 'temp-project',
      }),
    }),
  };
  return { program, checker, sf, collector };
}
