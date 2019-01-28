import { SerializedSourceFile, WalkerOutputData } from '@code-to-json/core';
import { refId } from '@code-to-json/utils';
import { DataCollector } from './data-collector';
import resolveReference from './resolve-reference';
import { FormattedSourceFile, FormattedSourceFileRef } from './types';

export default function formatSourceFile(
  wo: WalkerOutputData,
  sourceFile: Readonly<SerializedSourceFile>,
  ref: FormattedSourceFileRef,
  collector: DataCollector,
): FormattedSourceFile {
  const { pathInPackage, extension, isDeclarationFile, moduleName, documentation } = sourceFile;
  const info: FormattedSourceFile = {
    id: refId(ref),
    path: `${pathInPackage}.${extension}`,
    moduleName,
    extension,
    isDeclarationFile,
  };
  if (documentation) {
    info.documentation = documentation;
  }
  const { symbol: symbolRef } = sourceFile;
  if (symbolRef) {
    const symbol = resolveReference(wo, symbolRef);

    info.symbol = collector.queue(symbol, 's');
  }
  return info;
}
