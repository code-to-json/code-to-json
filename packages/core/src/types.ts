import { CommentData } from '@code-to-json/comments';
import { Ref } from '@code-to-json/utils';
import * as ts from 'typescript';
import { Flags } from './flags';

export interface EntityMap {
  declaration: ts.Declaration;
  symbol: ts.Symbol;
  type: ts.Type;
  node: ts.Node;
  sourceFile: ts.SourceFile;
}

export interface SerializedEntity<THING extends string> {
  entity: THING;
  id: string;
  flags?: Flags;
  text?: string;
  name?: string;
}

export type CodePoisition = [string, number, number];
export type CodeRange = [string, number, number, number, number];

export interface HasPosition {
  sourceFile?: SourceFileRef;
  location: CodeRange;
}

export interface HasDocumentation {
  documentation?: CommentData;
  comment?: string;
}

export interface SerializedSignature {
  parameters?: SymbolRef[];
  typeParameters?: TypeRef[];
  declaration?: DeclarationRef;
  returnType?: TypeRef;
  comment?: string;
}

export type SymbolRef = Ref<'symbol'>;
export type DeclarationRef = Ref<'declaration'>;
export type NodeRef = Ref<'node'>;
export type TypeRef = Ref<'type'>;
export type SourceFileRef = Ref<'sourceFile'>;

export interface RefRegistry {
  symbol: SymbolRef;
  node: NodeRef;
  declaration: DeclarationRef;
  type: TypeRef;
  sourceFile: SourceFileRef;
}
export interface SerializedAmdDependency {
  name?: string;
  path: string;
}

export interface SerializedNode<TYP extends string = 'node'>
  extends SerializedEntity<TYP>,
    HasPosition {
  text: string;
  kind: string;
  decorators?: string[];
  modifiers?: string[];
  isExposed: boolean;
  isExported: boolean;
  // parent?: NodeRef;
  // children?: NodeRef[];
  // type?: TypeRef;
}

export interface SerializedDeclaration
  extends Pick<SerializedNode, Exclude<keyof SerializedNode, 'thing'>> {
  thing: 'declaration';
}

export interface SerializedHeritageClause {
  clauseType: string;
}

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

export interface SerializedFileReference {
  name?: string;
  location?: CodeRange;
}

export interface SerializedCustomType
  extends Pick<SerializedBuiltInType, Exclude<keyof SerializedBuiltInType, 'typeKind'>> {
  symbol?: SymbolRef;
  aliasTypeArguments?: TypeRef[];
  aliasSymbol?: SymbolRef;
  defaultType?: TypeRef;
  constraint?: TypeRef;
  typeKind: 'custom';
}

export interface SerializedBuiltInType
  extends Pick<SerializedCoreType, Exclude<keyof SerializedCoreType, 'typeKind'>> {
  numberIndexType?: TypeRef;
  stringIndexType?: TypeRef;
  typeKind: 'built-in';
  default?: TypeRef;
  libName?: string;
  baseTypes?: TypeRef[];
  moduleName?: string;
}

export interface SerializedCoreType extends SerializedEntity<'type'> {
  typeKind: 'core';
  properties?: SymbolRef[];
  typeString: string;
  objectFlags?: Flags;
}

export type SerializedType = SerializedBuiltInType | SerializedCustomType | SerializedCoreType;

export interface SerializedSourceFile extends SerializedEntity<'sourceFile'>, HasDocumentation {
  originalFileName?: string;
  moduleName: string;
  extension: string | null;
  pathInPackage: string;

  isDeclarationFile: boolean;
  statements?: NodeRef[];
  symbol?: SymbolRef;
  amdDependencies?: SerializedAmdDependency[];
  referencedFiles?: SerializedFileReference[];
  typeReferenceDirectives?: SerializedFileReference[];
  libReferenceDirectives?: SerializedFileReference[];
}
