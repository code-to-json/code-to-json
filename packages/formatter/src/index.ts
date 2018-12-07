import { WalkerOutput } from '@code-to-json/core';
import formatSourceFile, { FormattedSourceFile } from './formatters/source-file';

interface FormattedOutput {
  sourceFiles: FormattedSourceFile[];
}

export function formatWalkerOutput(wo: WalkerOutput): FormattedOutput {
  const {
    data: { sourceFile }
  } = wo;
  return {
    sourceFiles: Object.keys(sourceFile).map(fn => formatSourceFile(wo.data, sourceFile[fn]))
  };
}
