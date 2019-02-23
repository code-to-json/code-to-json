import { CommentData } from '@code-to-json/comments';
import { Flags } from '@code-to-json/utils-ts';
import { Dict } from '@mike-north/types';
import { DeclarationRef, SourceFileRef, SymbolRef, TypeRef } from './ref';

// ======================================
// =============== SYMBOL ===============
// ======================================

export interface SerializedSymbolAttributes extends SerializedEntity<'symbol'> {
  name: string;
  external?: boolean;
  flags: Flags;
  modifiers?: string[];
  text: string;
  isAbstract?: boolean;
  jsDocTags?: Array<{
    name: string;
    text?: string;
  }>;
}

export interface SerializedHeritageClause {
  kind: 'extends' | 'implements';
  types: TypeRef[];
}

export interface SerializedSymbolRelationships {
  symbolType?: TypeRef;
  valueDeclarationType?: TypeRef;
  otherDeclarationTypes?: Array<{ declaration: DeclarationRef; type?: TypeRef }>;
  declarations?: DeclarationRef[];
  valueDeclaration?: DeclarationRef;
  location?: SerializedCodeRange;
  exports?: Dict<SymbolRef>;
  members?: Dict<SymbolRef>;
  decorators?: SymbolRef[];
  sourceFile?: SourceFileRef;
  globalExports?: Dict<SymbolRef>;
  relatedSymbols?: SymbolRef[];
  heritageClauses?: SerializedHeritageClause[];
  aliasedSymbol?: SymbolRef;
}

/**
 * Serialized representation of a ts.Symbol
 */
export interface SerializedSymbol
  extends HasDocumentation,
    SerializedSymbolAttributes,
    SerializedSymbolRelationships {}

// ======================================
// ============== TYPE ==================
// ======================================

export interface SerializedTypeAttributes extends SerializedEntity<'type'> {
  text: string;
  libName?: string;
  moduleName?: string;

  objectFlags?: Flags;
  flags: Flags;

  isPrimitive?: boolean;
  isThisType?: boolean;
}
export interface SerializedTypeRelationships {
  conditionalInfo?: SerializedTypeConditionInfo;
  numberIndexType?: TypeRef;
  stringIndexType?: TypeRef;
  default?: TypeRef;
  location?: SerializedCodeRange;
  types?: TypeRef[];
  baseTypes?: TypeRef[];
  symbol?: SymbolRef;
  target?: TypeRef;
  relatedTypes?: TypeRef[];
  sourceFile?: SourceFileRef;
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
  constructorSignatures?: SerializedSignature[];
  callSignatures?: SerializedSignature[];
}

/**
 * Serialized representation of a type
 */
export interface SerializedType
  extends SerializedTypeAttributes,
    SerializedTypeRelationships,
    HasDocumentation {}

export interface SerializedTypeConditionInfo {
  extendsType: TypeRef;
  checkType: TypeRef;
  falseType?: TypeRef;
  trueType?: TypeRef;
}

// ======================================
// ============= SOURCE FILE ============
// ======================================

export interface SerializedSourceFileAttributes extends SerializedEntity<'sourceFile'> {
  originalFileName?: string;
  moduleName: string;
  extension: string | null;
  pathInPackage: string;
  isDeclarationFile: boolean;
}
export interface SerializedSourceFileRelationships {
  amdDependencies?: AmdDependency[];
  symbol?: SymbolRef;
  referencedFiles?: SerializedFileReference[];
  typeReferenceDirectives?: SerializedFileReference[];
  libReferenceDirectives?: SerializedFileReference[];
}

/**
 * Serialized representation of a ts.Sourcefile
 */
export interface SerializedSourceFile
  extends SerializedSourceFileAttributes,
    SerializedSourceFileRelationships,
    HasDocumentation {}

// ======================================
// ============= SIGNATURE ==============
// ======================================

export interface SerializedSignatureAttributes {
  hasRestParameter: boolean;
  modifiers?: string[];
  comment?: string;
  text?: string;
}
export interface SerializedSignatureRelationships {
  returnType?: TypeRef;
  parameters?: SymbolRef[];
  typeParameters?: TypeRef[];
  typePredicate?: TypeRef;
}
/**
 * Serialized representation of a ts.Signature
 */
export interface SerializedSignature
  extends HasDocumentation,
    SerializedSignatureAttributes,
    SerializedSignatureRelationships {}

// ======================================
// ============== NODE ==================
// ======================================

/**
 * Serialized representation of a ts.Node
 *
 * @template EntityName name of the node sub-type (i.e. "node" or "declaration"). Should be a string literal type
 */
export interface SerializedNode<Type extends string = 'node'> extends SerializedEntity<Type> {
  text: string;
  syntaxKind: string;
  location?: SerializedCodeRange;
}

// ======================================
// ========== DECLARATION ===============
// ======================================

/**
 * Serialized representation of a ts.Declaration
 */
export interface SerializedDeclaration extends SerializedNode<'declaration'> {}

// ======================================
// ============= OTHER ==================
// ======================================

/**
 * Serialized representation of a ts.FileReference
 */
export interface SerializedFileReference {
  name?: string;
  location?: SerializedCodeRange;
}

/**
 * An entity that is (or may be associated with) a declaration that has block comment
 */
export interface HasDocumentation {
  documentation?: CommentData;
  comment?: string;
}

/**
 * Serialized representation of a ts.AmdDependency
 */
export interface AmdDependency {
  name?: string;
  path: string;
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
export type SerializedCodePoisition = [SourceFileRef, number, number];

/**
 * Serialized representation of a range of text within a file.
 *
 * convention: [<source file>,
 *              <start line number>,
 *              <start character number>,
 *              <end line number>,
 *              <end character number>]
 */
export type SerializedCodeRange = [SourceFileRef, number, number, number, number];
