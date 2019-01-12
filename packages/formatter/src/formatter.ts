import { WalkerOutput } from '@code-to-json/core';
import formatSourceFile from './source-file';
import { FormattedSourceFile } from './types';

export interface FormatterOutput {
  sourceFiles: FormattedSourceFile[];
}

// tslint:disable-next-line:no-empty-interface
export interface FormatterOptions {}

// eslint-disable-next-line import/prefer-default-export
export function formatWalkerOutput(
  wo: WalkerOutput,
  _opts: Partial<FormatterOptions> = {},
): FormatterOutput {
  const {
    data: { sourceFile },
  } = wo;
  return {
    sourceFiles: Object.keys(sourceFile).map(fn => formatSourceFile(wo.data, sourceFile[fn])),
  };
}
