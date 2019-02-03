import { CommentData } from '@code-to-json/comments';
import { Ref } from '@code-to-json/utils';
import { Flags } from '@code-to-json/utils-ts';
import { Dict } from '@mike-north/types';

export type FormattedTypeRef = Ref<'t'>;
export type FormattedSymbolRef = Ref<'s'>;
export type FormattedDeclarationRef = Ref<'d'>;
export type FormattedNodeRef = Ref<'d'>;
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
  sourceFile?: FormattedSourceFileRef;
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
}

export interface FormattedTypeConditionInfo {
  extendsType: FormattedTypeRef;
  checkType: FormattedTypeRef;
  falseType?: FormattedTypeRef;
  trueType?: FormattedTypeRef;
}

export interface FormattedType extends FormattedEntity {
  text: string;
  flags?: Flags;
  objectFlags?: Flags;
  symbol?: FormattedSymbolRef;
  constraint?: FormattedTypeRef;
  properties?: Dict<FormattedSymbolRef>;
  baseTypes?: FormattedTypeRef[];
  isThisType?: boolean;
  thisType?: FormattedTypeRef;
  isOptional?: boolean;
  numberIndexType?: FormattedTypeRef;
  stringIndexType?: FormattedTypeRef;
  defaultType?: FormattedTypeRef;
  callSignatures?: FormattedSignature[];
  constructorSignatures?: FormattedSignature[];
  typeParameters?: FormattedTypeRef[];
  types?: FormattedTypeRef[];
  libName?: string;
  conditionalInfo?: FormattedTypeConditionInfo;
}

export interface FormattedSymbol extends FormattedEntity, HasDocumentation, HasPosition {
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
  // modifiers?: string[];
  decorators?: FormattedSymbolRef[];
  // heritageClauses?: string[];
  exports?: Dict<FormattedSymbolRef>;
  globalExports?: Dict<FormattedSymbolRef>;
  members?: Dict<FormattedSymbolRef>;
  properties?: Dict<FormattedSymbolRef>;
  jsDocTags?: Array<{ name: string; text?: string }>;
  type?: FormattedTypeRef;
  valueType?: FormattedTypeRef;
  otherDeclarationTypes?: Array<{ declaration: FormattedDeclarationRef; type?: FormattedTypeRef }>;
  related?: FormattedSymbolRef[];
}

export interface FormattedSignature {
  hasRestParameter: boolean;
  parameters?: Array<{ name: string; type?: FormattedTypeRef }>;
  typeParameters?: FormattedTypeRef[];
  returnType?: FormattedTypeRef;
}

// tslint:disable-next-line:no-empty-interface
export interface FormattedDeclaration extends FormattedEntity {}

export interface FormattedSourceFile extends FormattedEntity, HasDocumentation {
  path: string;
  moduleName: string;
  extension: string | null;
  isDeclarationFile: boolean;
  symbol?: FormattedSymbolRef;
}

export interface FormattedEntity {
  id: string;
}
