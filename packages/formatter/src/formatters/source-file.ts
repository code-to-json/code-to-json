import { SerializedSourceFile, WalkerOutputData } from '@code-to-json/core';
import resolveReference from '../resolve-reference';
import formatSymbol, { FormattedSymbol } from './symbol';

export interface FormattedSourceFile extends Partial<FormattedSymbol> {
  fileName: string;
  isDeclarationFile: boolean;
  referencedFiles?: string[];
}

export default function formatSourceFile(
  wo: WalkerOutputData,
  sourceFile: Readonly<SerializedSourceFile>,
): FormattedSourceFile {
  const { fileName, isDeclarationFile, referencedFiles } = sourceFile;
  const info: FormattedSourceFile = {
    fileName: fileName || '(unknown)',
    isDeclarationFile,
  };
  if (referencedFiles && referencedFiles.length > 0) {
    info.referencedFiles = referencedFiles.map(f => f.name as string).filter(Boolean);
  }
  const { symbol: symbolRef } = sourceFile;
  if (symbolRef) {
    const symbol = resolveReference(wo, symbolRef);
    const serializedSymbol = formatSymbol(wo, symbol);
    Object.assign(info, serializedSymbol);
  }
  return info;
}
