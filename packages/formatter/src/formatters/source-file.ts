import { SerializedSourceFile, WalkerOutputData } from '@code-to-json/core';
import resolveReference from '../resolve-reference';
import formatSymbol, { FormattedSymbol } from './symbol';

export interface FormattedSourceFile extends Partial<FormattedSymbol> {
  pathInPackage: string;
  moduleName: string;
  extension: string | null;
  isDeclarationFile: boolean;
  referencedFiles?: string[];
}

export default function formatSourceFile(
  wo: WalkerOutputData,
  sourceFile: Readonly<SerializedSourceFile>,
): FormattedSourceFile {
  const { pathInPackage, extension, isDeclarationFile, referencedFiles, moduleName } = sourceFile;
  const info: FormattedSourceFile = {
    pathInPackage,
    moduleName,
    extension,
    isDeclarationFile,
  };
  if (referencedFiles && referencedFiles.length > 0) {
    info.referencedFiles = referencedFiles.map(f => f.name as string).filter(Boolean);
  }
  const { symbol: symbolRef } = sourceFile;
  if (symbolRef) {
    const symbol = resolveReference(wo, symbolRef);
    const serializedSymbol = formatSymbol(wo, symbol);
    Object.assign(info, serializedSymbol, { name: moduleName });
  }
  return info;
}
