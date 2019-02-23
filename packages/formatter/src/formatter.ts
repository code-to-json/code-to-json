import {
  SerializedDeclaration,
  SerializedNode,
  SerializedSourceFile,
  SerializedSymbol,
  SerializedType,
  WalkerOutput,
} from '@code-to-json/core';
import { isDefined } from '@code-to-json/utils';
import { create as createDataCollector } from './data-collector';
import formatDeclaration from './declaration';
import formatNode from './node';
import formatSourceFile from './source-file';
import formatSymbol from './symbol';
import formatType from './type';
import {
  FormattedDeclaration,
  FormattedDeclarationRef,
  FormattedNode,
  FormattedNodeRef,
  FormattedSourceFile,
  FormattedSourceFileRef,
  FormattedSymbol,
  FormattedSymbolRef,
  FormattedType,
  FormattedTypeRef,
} from './types';

export interface FormatterOutputMetadata {
  versions: {
    core: string;
  };
  format: 'formatted';
}

export interface FormatterOutputData {
  sourceFiles: { [k: string]: FormattedSourceFile };
  types: { [k: string]: FormattedType };
  symbols: { [k: string]: FormattedSymbol };
  declarations: { [k: string]: FormattedDeclaration };
  nodes: { [k: string]: FormattedNode };
}

export interface FormatterOutput {
  codeToJson: FormatterOutputMetadata;
  data: FormatterOutputData;
}


export interface FormatterOptions {}

// eslint-disable-next-line import/prefer-default-export
export function formatWalkerOutput(
  wo: WalkerOutput,
  _opts: Partial<FormatterOptions> = {},
): FormatterOutput {
  const {
    data: { sourceFiles },
  } = wo;
  const collector = createDataCollector();
  Object.keys(sourceFiles)
    .map((sf) => sourceFiles[sf])
    .filter(isDefined)
    .forEach((sf) => collector.queue(sf, 'f'));
  const data = collector.drain({
    handleType(ref: FormattedTypeRef, item: SerializedType): FormattedType {
      return formatType(wo.data, item, ref, collector);
    },
    handleSourceFile(ref: FormattedSourceFileRef, item: SerializedSourceFile): FormattedSourceFile {
      return formatSourceFile(wo.data, item, ref, collector);
    },
    handleSymbol(ref: FormattedSymbolRef, item: SerializedSymbol): FormattedSymbol {
      return formatSymbol(wo.data, item, ref, collector);
    },
    handleDeclaration(
      ref: FormattedDeclarationRef,
      item: SerializedDeclaration,
    ): FormattedDeclaration {
      return formatDeclaration(wo.data, item, ref, collector);
    },
    handleNode(ref: FormattedNodeRef, item: SerializedNode): FormattedNode {
      return formatNode(wo.data, item, ref, collector);
    },
  });
  return {
    codeToJson: {
      versions: {
        core: 'pkg.version',
      },
      format: 'formatted',
    },
    data,
  };
}
