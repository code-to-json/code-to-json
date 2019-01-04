/* eslint-disable import/prefer-default-export */
import { createProgramFromCodeString } from '@code-to-json/utils-ts';
import { create as createQueue } from '../../src/processing-queue';

export function setupScenario(code: string) {
  const workspace = createProgramFromCodeString(code, 'ts');
  const { program } = workspace;
  const [sf] = program.getSourceFiles().filter(f => !f.isDeclarationFile);
  if (!sf) {
    throw new Error('No SourceFile module.ts found');
  }

  const checker = program.getTypeChecker();

  const q = createQueue();
  return { program, checker, sf, q };
}
