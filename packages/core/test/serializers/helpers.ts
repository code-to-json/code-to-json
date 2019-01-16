import { nodeHost } from '@code-to-json/utils-node';
import {
  createProgramFromCodeString,
  generateModulePathNormalizer,
  PASSTHROUGH_MODULE_PATH_NORMALIZER,
} from '@code-to-json/utils-ts';
import { create as createQueue } from '../../src/processing-queue';
import { Collector } from '../../src/types/walker';

export function setupScenario(code: string) {
  const workspace = createProgramFromCodeString(code, 'ts');
  const { program } = workspace;
  const [sf] = program.getSourceFiles().filter(f => !f.isDeclarationFile);
  if (!sf) {
    throw new Error('No SourceFile module.ts found');
  }

  const checker = program.getTypeChecker();

  const queue = createQueue(checker);
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
