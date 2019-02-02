import * as ts from 'typescript';

const DECLARATION_KINDS = [
  ts.SyntaxKind.SourceFile,
  ts.SyntaxKind.ArrowFunction,
  ts.SyntaxKind.BindingElement,
  ts.SyntaxKind.ClassDeclaration,
  ts.SyntaxKind.ClassExpression,
  ts.SyntaxKind.Constructor,
  ts.SyntaxKind.EnumDeclaration,
  ts.SyntaxKind.EnumMember,
  ts.SyntaxKind.ExportSpecifier,
  ts.SyntaxKind.FunctionDeclaration,
  ts.SyntaxKind.FunctionExpression,
  ts.SyntaxKind.GetAccessor,
  ts.SyntaxKind.ImportClause,
  ts.SyntaxKind.ImportEqualsDeclaration,
  ts.SyntaxKind.ImportSpecifier,
  ts.SyntaxKind.InterfaceDeclaration,
  ts.SyntaxKind.JsxAttribute,
  ts.SyntaxKind.MethodDeclaration,
  ts.SyntaxKind.MethodSignature,
  ts.SyntaxKind.ModuleDeclaration,
  ts.SyntaxKind.NamespaceExportDeclaration,
  ts.SyntaxKind.NamespaceImport,
  ts.SyntaxKind.Parameter,
  ts.SyntaxKind.PropertyAssignment,
  ts.SyntaxKind.PropertyDeclaration,
  ts.SyntaxKind.PropertySignature,
  ts.SyntaxKind.SetAccessor,
  ts.SyntaxKind.ShorthandPropertyAssignment,
  ts.SyntaxKind.TypeAliasDeclaration,
  ts.SyntaxKind.TypeParameter,
  ts.SyntaxKind.VariableDeclaration,
  ts.SyntaxKind.JSDocTypedefTag,
  ts.SyntaxKind.JSDocCallbackTag,
  ts.SyntaxKind.JSDocPropertyTag,
];

export * from './type';

/**
 * Returns true if the specified SyntaxKind is part of a declaration form.
 *
 * Based on isDeclarationKind() from the compiler.
 * https://github.com/Microsoft/TypeScript/blob/v3.0.3/src/compiler/utilities.ts#L6382
 */
function isDeclarationKind(kind: ts.SyntaxKind): boolean {
  return DECLARATION_KINDS.indexOf(kind) >= 0;
}

/**
 * Check to see whether a value is a Declaration
 * @param node value to check
 */
export function isDeclaration(node?: ts.Node | ts.Declaration): node is ts.Declaration {
  return !!node && isDeclarationKind(node.kind);
}

/**
 * Check to see whether a value is a Node
 * @param thing value to check
 */
export function isNode(thing: any): thing is ts.Node {
  return !!thing && typeof (thing as ts.Node).getChildAt === 'function';
}

/**
 * Check to see whether a value is a Type
 * @param thing value to check
 */
export function isType(thing: any): thing is ts.Type {
  return !!thing && !!(thing as ts.Type).getBaseTypes && !!(thing as ts.Type).isUnion;
}

/**
 * Check to see whether a value is a Symbol
 * @param thing value to check
 */
export function isSymbol(thing: any): thing is ts.Symbol {
  return !!thing && typeof (thing as ts.Symbol).getEscapedName === 'function';
}
