import { CommentData } from '@code-to-json/comments';
import { Flags } from '@code-to-json/utils-ts';
import { Dict } from '@mike-north/types';
import { DeclarationRef, SourceFileRef, SymbolRef, TypeRef } from './ref';

/**
 * Serialized representation of a ts.Sourcefile
 */
export interface SerializedSourceFile extends SerializedEntity<'sourceFile'>, HasDocumentation {
  originalFileName?: string;
  moduleName: string;
  extension: string | null;
  pathInPackage: string;

  isDeclarationFile: boolean;
  symbol?: SymbolRef;
  amdDependencies?: SerializedAmdDependency[];
  referencedFiles?: SerializedFileReference[];
  typeReferenceDirectives?: SerializedFileReference[];
  libReferenceDirectives?: SerializedFileReference[];
}

/**
 * Serialized representation of a ts.Symbol
 */
export interface SerializedSymbol
  extends SerializedEntity<'symbol'>,
    HasPosition<SourceFileRef>,
    HasDocumentation {
  name: string;
  external?: boolean;
  type?: TypeRef;
  members?: Dict<SymbolRef>;
  exports?: Dict<SymbolRef>;
  decorators?: string[];
  modifiers?: string[];
  globalExports?: Dict<SymbolRef>;
  heritageClauses?: SerializedHeritageClause[];
  jsDocTags?: Array<{
    name: string;
    text?: string;
  }>;
}

/**
 * Serialized representation of a ts.Signature
 */
export interface SerializedSignature {
  parameters?: SymbolRef[];
  typeParameters?: TypeRef[];
  typePredicate?: TypeRef;
  declaration?: DeclarationRef;
  returnType?: TypeRef;
  comment?: string;
}

/**
 * Serialized representation of a ts.FileReference
 */
export interface SerializedFileReference {
  name?: string;
  location?: CodeRange;
}

/**
 * Serialized representation of a code location
 * within a ts.SourceFile
 */
export interface HasPosition<FileRef = SourceFileRef> {
  sourceFile?: FileRef;
  location?: CodeRange;
}

/**
 * An entity that is (or may be associated with) a declaration that has block comment
 */
export interface HasDocumentation {
  documentation?: CommentData;
  comment?: string;
}

/**
 * Serialized representation of a ts.Signature
 */
export interface SerializedSignature {
  parameters?: SymbolRef[];
  typeParameters?: TypeRef[];
  declaration?: DeclarationRef;
  returnType?: TypeRef;
  comment?: string;
}

/**
 * Serialized representation of a ts.AmdDependency
 */
export interface SerializedAmdDependency {
  name?: string;
  path: string;
}

/**
 * Serialized representation of a ts.Node
 *
 * @template EntityName name of the node sub-type (i.e. "node" or "declaration"). Should be a string literal type
 */
export interface SerializedNode<Type extends string = 'node'>
  extends SerializedEntity<Type>,
    HasPosition<SourceFileRef> {
  text: string;
  kind: string;
  decorators?: string[];
  modifiers?: string[];
  isExposed: boolean;
  isExported: boolean;
}

/**
 * Serialized representation of a ts.Declaration
 */
export interface SerializedDeclaration extends SerializedNode<'declaration'> {}

/**
 * Serialized representation of a ts.HeritageClause
 */
export interface SerializedHeritageClause {
  // TODO: constrain to a string literal type
  clauseType: string;
}

/**
 * Serialized representation of a type
 */
export interface SerializedType extends SerializedEntity<'type'>, HasDocumentation {
  aliasTypeArguments?: TypeRef[];
  typeArguments?: TypeRef[];
  typeParameters?: TypeRef[];
  constraint?: TypeRef;
  templateType?: TypeRef;
  thisType?: TypeRef;
  modifiersType?: TypeRef;
  aliasSymbol?: SymbolRef;
  defaultType?: TypeRef;
  simplified?: TypeRef;
  indexType?: TypeRef;
  objectType?: TypeRef;
  properties?: Dict<SymbolRef>;
  typeString: string;
  primitive?: boolean;
  objectFlags?: Flags;
  numberIndexType?: TypeRef;
  stringIndexType?: TypeRef;
  default?: TypeRef;
  libName?: string;
  types?: TypeRef[];
  baseTypes?: TypeRef[];
  moduleName?: string;
  symbol?: SymbolRef;
  target?: TypeRef;
  sourceFile?: SourceFileRef;
  constructorSignatures?: SerializedSignature[];
  callSignatures?: SerializedSignature[];
}
/**
 * Serialized code entity
 *
 * @template EntityName name of the entity type. Should be a string literal type
 */
export interface SerializedEntity<EntityName extends string> {
  entity: EntityName;
  id: string;
  flags?: Flags;
  name?: string;
}

/**
 * Serialized representation of a position within a file.
 *
 * convention: [<source file>, <line number>, <character number>]
 */
export type CodePoisition = [SourceFileRef, number, number];

/**
 * Serialized representation of a range of text within a file.
 *
 * convention: [<source file>,
 *              <start line number>,
 *              <start character number>,
 *              <end line number>,
 *              <end character number>]
 */
export type CodeRange = [SourceFileRef, number, number, number, number];
