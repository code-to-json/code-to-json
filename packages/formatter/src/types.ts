import { CommentData } from '@code-to-json/comments';
import { Ref } from '@code-to-json/utils';
import { Dict } from '@mike-north/types';

export type FormattedTypeRef = Ref<'t'>;
export type FormattedSymbolRef = Ref<'s'>;
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
}

export enum FormattedSymbolKind {
  variable = 'variable',
  module = 'module',
  class = 'class',
  method = 'method',
  function = 'function',
  property = 'property',
  interface = 'interface',
  typeAlias = 'typeAlias',
  typeParameter = 'typeParameter',
  enum = 'enum',
  constEnum = 'constEnum',
  enumMember = 'enumMember',
  typeLiteral = 'typeLiteral',
}

export enum FormattedTypeKind {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  null = 'null',
  undefined = 'undefined',
  essymbol = 'essymbol',

  never = 'never',
  any = 'any',

  void = 'void',
  unknown = 'unknown',

  stringLiteral = 'stringLiteral',
  booleanLiteral = 'booleanLiteral',
  numberLiteral = 'numberLiteral',
  enumLiteral = 'enumLiteral',

  object = 'object',
  typeParameter = 'typeParameter',

  union = 'union',
  intersection = 'intersection',
}
export enum FormattedObjectTypeKind {
  anonymous = 'anonymous',
  class = 'class',
  interface = 'interface',
}

export interface FormattedType<
  K extends FormattedTypeKind = FormattedTypeKind,
  OK extends FormattedObjectTypeKind = FormattedObjectTypeKind
> extends FormattedEntity {
  text: string;
  flags?: string[];
  kind: K;
  objectKind?: OK;
  symbol?: FormattedSymbolRef;
  constraint?: FormattedTypeRef;
  objectFlags?: string[];
  properties?: Dict<FormattedSymbolRef>;
  baseTypes?: FormattedTypeRef[];
  isThisType?: boolean;
  thisType?: FormattedTypeRef;
  isReferenceType?: boolean;
  numberIndexType?: FormattedTypeRef;
  stringIndexType?: FormattedTypeRef;
  defaultType?: FormattedTypeRef;
  callSignatures?: FormattedSignature[];
  constructorSignatures?: FormattedSignature[];
  typeParameters?: FormattedTypeRef[];
  types?: FormattedTypeRef[];
  libName?: string;
}

export interface FormattedEnumLiteralType extends FormattedType<FormattedTypeKind.enumLiteral> {
  enumKind: FormattedTypeKind.numberLiteral | FormattedTypeKind.stringLiteral;
}
export interface FormattedSymbol<K extends FormattedSymbolKind = FormattedSymbolKind>
  extends FormattedEntity,
    HasDocumentation,
    HasPosition {
  name: string;
  kind: K;
  text?: string;
  isAbstract?: boolean;
  documentation?: CommentData;
  flags?: string[];
  external?: boolean;
  isTransient?: boolean;
  isConst?: boolean;
  isExported?: boolean;
  accessModifier?: 'private' | 'public' | 'protected';
  isStatic?: boolean;
  isAsync?: boolean;
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
  related?: FormattedSymbolRef[];
  instanceType?: FormattedTypeRef;
}

export interface FormattedSignature {
  hasRestParameter: boolean;
  parameters?: Array<{ name: string; type?: FormattedTypeRef }>;
  typeParameters?: FormattedTypeRef[];
  returnType?: FormattedTypeRef;
}

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
