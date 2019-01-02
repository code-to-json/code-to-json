/* eslint-disable import/prefer-default-export */
import { transpileCodeString } from '@code-to-json/utils-ts';
import { create as createQueue, ProcessingQueue } from '../../src/processing-queue';

export function setupScenario(code: string) {
  const workspace = transpileCodeString(code, 'ts');
  const { program } = workspace;
  const [sf] = program.getSourceFiles().filter(f => !f.isDeclarationFile);
  if (!sf) {
    throw new Error('No SourceFile module.ts found');
  }

  const checker = program.getTypeChecker();

  const q = createQueue();
  return { program, checker, sf, q };
}
