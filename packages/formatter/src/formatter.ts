import {
  SerializedSourceFile,
  SerializedSymbol,
  SerializedType,
  WalkerOutput,
} from '@code-to-json/core';
import { create as createDataCollector } from './data-collector';
import formatSourceFile from './source-file';
import formatSymbol from './symbol';
import formatType from './type';
import {
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
}

export interface FormatterOutput {
  codeToJson: FormatterOutputMetadata;
  data: FormatterOutputData;
}

// tslint:disable-next-line:no-empty-interface
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
  Object.keys(sourceFiles).forEach(sf => collector.queue(sourceFiles[sf]!, 'f'));
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
