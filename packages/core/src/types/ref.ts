import { Ref } from '@code-to-json/utils';
import * as ts from 'typescript';
import {
  SerializedDeclaration,
  SerializedNode,
  SerializedSourceFile,
  SerializedSymbol,
  SerializedType,
} from './serialized-entities';

export interface EntityMap {
  declaration: ts.Declaration;
  symbol: ts.Symbol;
  type: ts.Type;
  node: ts.Node;
  sourceFile: ts.SourceFile;
}

export interface SerializedOutputMap {
  declaration: SerializedDeclaration;
  symbol: SerializedSymbol;
  type: SerializedType;
  node: SerializedNode;
  sourceFile: SerializedSourceFile;
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
