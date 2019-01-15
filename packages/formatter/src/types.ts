import { CommentData } from '@code-to-json/comments';
import { SerializedSourceFile, SerializedSymbol, SerializedType } from '@code-to-json/core';
import { Queue, Ref } from '@code-to-json/utils';
import { Dict } from '@mike-north/types';

export type FormattedTypeRef = Ref<'t'>;
export type FormattedSymbolRef = Ref<'s'>;
export type FormattedSourceFileRef = Ref<'f'>;

export interface FormatterRefRegistry {
  t: FormattedTypeRef;
  s: FormattedSymbolRef;
  f: FormattedSourceFileRef;
}

export interface SideloadedDataCollector {
  types: Queue<'t', SerializedType>;
  symbols: Queue<'s', SerializedSymbol>;
  sourceFiles: Queue<'f', SerializedSourceFile>;
}

export interface FormattedType {
  text: string;
  flags?: string[];
  constraint?: FormattedTypeRef;
  objectFlags?: string[];
  properties?: Dict<FormattedSymbolRef>;
  baseTypes?: FormattedTypeRef[];
  numberIndexType?: FormattedTypeRef;
  stringIndexType?: FormattedTypeRef;
  aliasSymbol?: FormattedSymbolRef;
  aliasTypeArguments?: FormattedTypeRef[];
  defaultType?: FormattedTypeRef;
  libName?: string;
}

export interface FormattedSymbol {
  name: string;
  documentation?: CommentData;
  flags?: string[];
  modifiers?: string[];
  decorators?: string[];
  heritageClauses?: string[];
  exports?: Dict<FormattedSymbolRef>;
  members?: Dict<FormattedSymbolRef>;
  jsDocTags?: Array<{ name: string; text?: string }>;
  callSignatures?: FormattedSignature[];
  constructorSignatures?: FormattedSignature[];
  type?: FormattedTypeRef;
}

export interface FormattedSignature {
  parameters?: Array<{ name: string; type?: FormattedTypeRef }>;
  typeParameters?: FormattedTypeRef[];
  returnType?: FormattedTypeRef;
}

export interface FormattedSourceFile extends Partial<FormattedSymbol> {
  pathInPackage: string;
  moduleName: string;
  extension: string | null;
  isDeclarationFile: boolean;
  referencedFiles?: string[];
}
