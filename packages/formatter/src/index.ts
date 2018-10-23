import { WalkerOutput } from '@code-to-json/core';
import formatSourceFile, { FormattedSourceFile } from './formatters/source-file';

interface FormattedProgramInfo {
  sourceFiles: FormattedSourceFile[];
}

export function formatWalkerOutput(wo: WalkerOutput): FormattedProgramInfo {
  const { sourceFile } = wo;
  return {
    sourceFiles: Object.keys(sourceFile).map(fn => formatSourceFile(wo, sourceFile[fn]))
  };
}
