import { CommentData } from '@code-to-json/comments';
import { Ref } from '@code-to-json/utils';
import { Flags } from '@code-to-json/utils-ts';
import { Dict } from '@mike-north/types';

export type FormattedTypeRef = Ref<'t'>;
export type FormattedSymbolRef = Ref<'s'>;
export type FormattedDeclarationRef = Ref<'d'>;
export type FormattedNodeRef = Ref<'n'>;
export type FormattedSourceFileRef = Ref<'f'>;

/**
 * Serialized representation of a position within a file.
 *
 * convention: [<source file>, <line number>, <character number>]
 */
export type CodePoisition = [FormattedSourceFileRef, number, number];

/**
 * Serialized representation of a range of text within a file.
 *
 * convention: [<source file>,
 *              <start line number>,
 *              <start character number>,
 *              <end line number>,
 *              <end character number>]
 */
export type CodeRange = [FormattedSourceFileRef, number, number, number, number];

/**
 * Serialized representation of a code location
 * within a file
 */
export interface HasPosition {
  location?: CodeRange;
}

/**
 * An entity that is (or may be associated with) a declaration that has block comment
 */
export interface HasDocumentation {
  documentation?: CommentData;
  comment?: string;
}

export interface FormatterRefRegistry {
  t: FormattedTypeRef;
  s: FormattedSymbolRef;
  f: FormattedSourceFileRef;
  d: FormattedDeclarationRef;
  n: FormattedNodeRef;
}

export interface FormattedTypeConditionInfo {
  extendsType: FormattedTypeRef;
  checkType: FormattedTypeRef;
  falseType?: FormattedTypeRef;
  trueType?: FormattedTypeRef;
}

export interface FormattedType extends FormattedTypeAttributes, FormattedTypeRelationships {}
export interface FormattedTypeAttributes extends FormattedEntity<'type'> {
  text: string;
  flags?: Flags;
  objectFlags?: Flags;
  isThisType?: boolean;
  isOptional?: boolean;
  libName?: string;
}
export interface FormattedTypeRelationships {
  symbol?: FormattedSymbolRef;
  constraint?: FormattedTypeRef;
  properties?: Dict<FormattedSymbolRef>;
  baseTypes?: FormattedTypeRef[];
  thisType?: FormattedTypeRef;
  numberIndexType?: FormattedTypeRef;
  stringIndexType?: FormattedTypeRef;
  defaultType?: FormattedTypeRef;
  callSignatures?: FormattedSignature[];
  constructorSignatures?: FormattedSignature[];
  typeParameters?: FormattedTypeRef[];
  types?: FormattedTypeRef[];
  conditionalInfo?: FormattedTypeConditionInfo;
}

export interface FormattedSymbol extends FormattedSymbolAttributes, FormattedSymbolRelationships {}
export interface FormattedSymbolAttributes extends FormattedEntity<'symbol'>, HasDocumentation {
  name: string;
  text?: string;
  flags?: Flags;
  isAbstract?: boolean;
  documentation?: CommentData;
  external?: boolean;
  isConst?: boolean;
  isExported?: boolean;
  accessModifier?: 'private' | 'public' | 'protected';
  isStatic?: boolean;
  isAsync?: boolean;
  isReadOnly?: boolean;
  isAnonymous?: boolean;
  jsDocTags?: Array<{ name: string; text?: string }>;
}
export interface FormattedSymbolRelationships extends HasPosition {
  otherDeclarationTypes?: Array<{ declaration: FormattedDeclarationRef; type?: FormattedTypeRef }>;
  decorators?: FormattedSymbolRef[];
  exports?: Dict<FormattedSymbolRef>;
  globalExports?: Dict<FormattedSymbolRef>;
  members?: Dict<FormattedSymbolRef>;
  properties?: Dict<FormattedSymbolRef>;
  type?: FormattedTypeRef;
  valueType?: FormattedTypeRef;
  related?: FormattedSymbolRef[];
  valueDeclaration?: FormattedDeclarationRef;
}

export interface FormattedSignature
  extends HasDocumentation, FormattedSignatureAttributes,
    FormattedSignatureRelationships {}
export interface FormattedSignatureAttributes {
  hasRestParameter: boolean;
}
export interface FormattedSignatureRelationships {
  hasRestParameter: boolean;
  parameters?: Array<{ name: string; type?: FormattedTypeRef }>;
  typeParameters?: FormattedTypeRef[];
  returnType?: FormattedTypeRef;
}

// tslint:disable-next-line:no-empty-interface
export interface FormattedNode<Kind extends string = 'node'> extends FormattedEntity<Kind> {}
// tslint:disable-next-line:no-empty-interface
export interface FormattedDeclaration extends FormattedNode<'declaration'> {}

export interface FormattedSourceFile
  extends FormattedSourceFileAttributes,
    FormattedSourceFileRelationships {}
export interface FormattedSourceFileAttributes
  extends FormattedEntity<'sourceFile'>,
    HasDocumentation {
  path: string;
  moduleName: string;
  extension: string | null;
  isDeclarationFile: boolean;
}
export interface FormattedSourceFileRelationships {
  symbol?: FormattedSymbolRef;
}

export interface FormattedEntity<Kind extends string> {
  kind: Kind;
  id: string;
}
