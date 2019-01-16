import { CommentData } from '@code-to-json/comments';
import { Flags } from '@code-to-json/utils-ts';
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
    Partial<HasPosition>,
    HasDocumentation {
  name: string;
  external?: boolean;
  type?: TypeRef;
  members?: SymbolRef[];
  exports?: SymbolRef[];
  decorators?: string[];
  modifiers?: string[];
  globalExports?: SymbolRef[];
  // declarations?: DeclarationRef[];
  constructorSignatures?: SerializedSignature[];
  callSignatures?: SerializedSignature[];
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
export interface HasPosition {
  sourceFile?: SourceFileRef;
  location: CodeRange;
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
    HasPosition {
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
 * Serialized representation of an "atomic" type that has no declaration file.
 * Examples include `string`, `number`, primitive literal types, etc...
 */
export interface SerializedAtomicType extends SerializedEntity<'type'> {
  typeKind: 'atomic';
  aliasTypeArguments?: TypeRef[];
  aliasSymbol?: SymbolRef;
  defaultType?: TypeRef;
  constraint?: TypeRef;
  properties?: SymbolRef[];
  typeString: string;
  objectFlags?: Flags;
}

/**
 * Serialized representation of a "built-in" type that comes with TypeScript
 * by way of an included "lib" declaration file. Examples include `Promise<T>`, `Array<T>`,
 * `Function`, `Object`, etc...
 */
export interface SerializedLibType
  extends Pick<SerializedAtomicType, Exclude<keyof SerializedAtomicType, 'typeKind'>> {
  typeKind: 'lib';
  numberIndexType?: TypeRef;
  stringIndexType?: TypeRef;
  default?: TypeRef;
  libName?: string;
  baseTypes?: TypeRef[];
  moduleName?: string;
}

/**
 * Serialized representation of a "custom" type that's provided either by the codebase
 * itself or a dependency. These can come from either `.ts` source files, or `.d.ts` declaration files
 */
export interface SerializedCustomType
  extends Pick<SerializedLibType, Exclude<keyof SerializedLibType, 'typeKind'>> {
  typeKind: 'custom';
  symbol?: SymbolRef;
}

/**
 * Serialized representation of a ts.Type
 */
export type SerializedType = SerializedLibType | SerializedCustomType | SerializedAtomicType;

/**
 * Serialized code entity
 *
 * @template EntityName name of the entity type. Should be a string literal type
 */
export interface SerializedEntity<EntityName extends string> {
  entity: EntityName;
  id: string;
  flags?: Flags;
  text?: string;
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
