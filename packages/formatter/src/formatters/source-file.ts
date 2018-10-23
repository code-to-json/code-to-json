import { SerializedSourceFile, WalkerOutput } from '@code-to-json/core';
import resolveReference from '../resolve-reference';
import formatSymbol, { FormattedSymbol } from './symbol';

export interface FormattedSourceFile extends Partial<FormattedSymbol> {
  fileName: string;
}

export default function formatSourceFile(
  wo: WalkerOutput,
  sourceFile: Readonly<SerializedSourceFile>
): FormattedSourceFile {
  const info: FormattedSourceFile = {
    fileName: sourceFile.fileName || '(unknown)'
  };
  const { symbol: symbolRef } = sourceFile;
  if (symbolRef) {
    const symbol = resolveReference(wo, symbolRef);
    const serializedSymbol = formatSymbol(wo, symbol);
    Object.assign(info, serializedSymbol);
  }
  return info;
}
