import { CommentData } from '@code-to-json/comments';

export interface FormattedType {
  text: string;
  flags?: string[];
  objectFlags?: string[];
  properties?: FormattedSymbol[];
  numberIndexType?: FormattedType;
  stringIndexType?: FormattedType;
}

export interface FormattedSymbol {
  name: string;
  documentation?: CommentData;
  flags?: string[];
  exports?: FormattedSymbol[];
  members?: FormattedSymbol[];
  jsDocTags?: Array<{ name: string; text?: string }>;
  callSignatures?: FormattedSignature[];
  constructorSignatures?: FormattedSignature[];
}

export interface FormattedSignature {
  parameters?: Array<{ name: string; type?: FormattedType }>;
  typeParameters?: FormattedType[];
  returnType?: FormattedType;
}

export interface FormattedSourceFile extends Partial<FormattedSymbol> {
  pathInPackage: string;
  moduleName: string;
  extension: string | null;
  isDeclarationFile: boolean;
  referencedFiles?: string[];
}
