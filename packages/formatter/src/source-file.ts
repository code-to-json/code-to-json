import { SerializedSourceFile, WalkerOutputData } from '@code-to-json/core';
import { createRef, refId } from '@code-to-json/utils';
import { DataCollector } from './data-collector';
import resolveReference from './resolve-reference';
import formatSymbol from './symbol';
import { FormattedSourceFile, FormattedSourceFileRef, FormatterRefRegistry } from './types';

export default function formatSourceFile(
  wo: WalkerOutputData,
  sourceFile: Readonly<SerializedSourceFile>,
  ref: FormattedSourceFileRef,
  collector: DataCollector,
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
    id: refId(ref),
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
    const serializedSymbol = formatSymbol(
      wo,
      symbol,
      createRef<FormatterRefRegistry, 's'>('s', info.id),
      collector,
    );
    Object.assign(info, serializedSymbol, { name: moduleName });
  }
  return info;
}
