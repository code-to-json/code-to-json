import { Ref } from '@code-to-json/utils';
import * as ts from 'typescript';

export interface EntityMap {
  declaration: ts.Declaration;
  symbol: ts.Symbol;
  type: ts.Type;
  node: ts.Node;
  sourceFile: ts.SourceFile;
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
