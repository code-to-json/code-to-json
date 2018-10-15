import * as ts from 'typescript';

export interface WalkData {
  typeRegistry: {
    [k: string]: any;
  };
}

export interface SerializedEnum<V> {
  value: V;
  text: string;
}

export interface WithFlags {
  flags?: null | string | string[];
  symbolFlags?: null | string | string[];
}

export interface SerializedType extends WithFlags {
  id: number;
  text: string;
}

export interface SerializedBaseNode<K extends ts.SyntaxKind> extends WithFlags {
  modifiers?: string[];
  decorators?: string[];
  pos: number;
  end: number;
  kind: SerializedEnum<K>;
}

export interface SerializedSourceFile
  extends SerializedBaseNode<ts.SyntaxKind.SourceFile> {
  fileName: string;
  languageVariant: string;
  languageVersion?: string;
  isDeclarationFile: boolean;
  children?: SerializedBaseNode<ts.SyntaxKind>[];
}

export interface SerializedImportDeclaration
  extends SerializedBaseNode<ts.SyntaxKind.ImportDeclaration> {
  moduleSpecifier: string;
  importClause?: SerializedImportClause;
}

export interface SerializedImportClause
  extends SerializedBaseNode<ts.SyntaxKind.ImportClause> {
  name?: string;
  namedBindings?: any;
}
export interface SerializedNamedBindings
  extends SerializedBaseNode<
      ts.SyntaxKind.NamespaceImport | ts.SyntaxKind.NamedImports
    > {
  elements?: {
    name: string;
    propertyName?: string;
  }[];
}

export interface SerializedFunctionDeclaration
  extends SerializedBaseNode<ts.SyntaxKind.FunctionDeclaration> {
  name?: string;
  typeId: number;
}

export interface SerializedClassDeclaration
  extends SerializedBaseNode<ts.SyntaxKind.ClassDeclaration> {
  name?: string;
  typeId: number;
}

export interface SerializedVariableStatement
  extends SerializedBaseNode<ts.SyntaxKind.VariableStatement> {
  declarations: SerializedVariableDeclaration[];
}

export interface SerializedVariableDeclaration
  extends SerializedBaseNode<ts.SyntaxKind.VariableDeclaration> {
  name?: string;
  typeId: number;
}
