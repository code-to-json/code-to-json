import { SerializedSourceFile, WalkerOutputData } from '@code-to-json/core';
import resolveReference from './resolve-reference';
import formatSymbol from './symbol';
import { FormattedSourceFile } from './types';

export default function formatSourceFile(
  wo: WalkerOutputData,
  sourceFile: Readonly<SerializedSourceFile>,
): FormattedSourceFile {
  const {
    pathInPackage,
    extension,
    isDeclarationFile,
    referencedFiles,
    moduleName,
    documentation,
  } = sourceFile;
  const info: FormattedSourceFile = {
    pathInPackage,
    moduleName,
    extension,
    isDeclarationFile,
  };
  if (documentation) {
    info.documentation = documentation;
  }
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
