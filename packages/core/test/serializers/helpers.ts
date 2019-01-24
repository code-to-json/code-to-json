import { nodeHost } from '@code-to-json/utils-node';
import { createProgramFromCodeString, generateModulePathNormalizer } from '@code-to-json/utils-ts';
import { create as createQueue } from '../../src/processing-queue';
import { Collector } from '../../src/types/walker';
import WalkerConfig from '../../src/walker/config';

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
    host: nodeHost,
    cfg: new WalkerConfig({
      includeDeclarations: 'none',
      pathNormalizer: generateModulePathNormalizer(nodeHost, {
        path: '.',
        name: 'temp-project',
      }),
    }),
  };
  return { program, checker, sf, collector };
}
