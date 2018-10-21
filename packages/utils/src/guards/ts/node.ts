import * as ts from 'typescript';

/**
 * Returns true if the specified SyntaxKind is part of a declaration form.
 *
 * Based on ts.isDeclarationKind() from the compiler.
 * https://github.com/Microsoft/TypeScript/blob/v3.0.3/src/compiler/utilities.ts#L6382
 */
function isDeclarationKind(kind: ts.SyntaxKind): boolean {
  return (
    kind === ts.SyntaxKind.SourceFile ||
    kind === ts.SyntaxKind.ArrowFunction ||
    kind === ts.SyntaxKind.BindingElement ||
    kind === ts.SyntaxKind.ClassDeclaration ||
    kind === ts.SyntaxKind.ClassExpression ||
    kind === ts.SyntaxKind.Constructor ||
    kind === ts.SyntaxKind.EnumDeclaration ||
    kind === ts.SyntaxKind.EnumMember ||
    kind === ts.SyntaxKind.ExportSpecifier ||
    kind === ts.SyntaxKind.FunctionDeclaration ||
    kind === ts.SyntaxKind.FunctionExpression ||
    kind === ts.SyntaxKind.GetAccessor ||
    kind === ts.SyntaxKind.ImportClause ||
    kind === ts.SyntaxKind.ImportEqualsDeclaration ||
    kind === ts.SyntaxKind.ImportSpecifier ||
    kind === ts.SyntaxKind.InterfaceDeclaration ||
    kind === ts.SyntaxKind.JsxAttribute ||
    kind === ts.SyntaxKind.MethodDeclaration ||
    kind === ts.SyntaxKind.MethodSignature ||
    kind === ts.SyntaxKind.ModuleDeclaration ||
    kind === ts.SyntaxKind.NamespaceExportDeclaration ||
    kind === ts.SyntaxKind.NamespaceImport ||
    kind === ts.SyntaxKind.Parameter ||
    kind === ts.SyntaxKind.PropertyAssignment ||
    kind === ts.SyntaxKind.PropertyDeclaration ||
    kind === ts.SyntaxKind.PropertySignature ||
    kind === ts.SyntaxKind.SetAccessor ||
    kind === ts.SyntaxKind.ShorthandPropertyAssignment ||
    kind === ts.SyntaxKind.TypeAliasDeclaration ||
    kind === ts.SyntaxKind.TypeParameter ||
    kind === ts.SyntaxKind.VariableDeclaration ||
    kind === ts.SyntaxKind.JSDocTypedefTag ||
    kind === ts.SyntaxKind.JSDocCallbackTag ||
    kind === ts.SyntaxKind.JSDocPropertyTag
  );
}

/**
 * Check to see whether a value is a named declaration
 * @param node value to check
 */
export function isNamedDeclaration(node: ts.Node): node is ts.NamedDeclaration {
  return (
    ts.isClassLike(node) ||
    ts.isFunctionLike(node) ||
    ts.isTypeParameterDeclaration(node) ||
    ts.isParameter(node) ||
    ts.isObjectLiteralElement(node) ||
    ts.isPropertyDeclaration(node) ||
    ts.isVariableDeclaration(node)
  );
}

/**
 * Check to see whether a value is a ts.Declaration
 * @param node value to check
 */
export function isDeclaration(
  node: ts.Node | ts.Declaration
): node is ts.Declaration {
  return isDeclarationKind(node.kind);
}

/**
 * Check to see whether a value is a ts.Type
 * @param thing value to check
 */
export function isType(
  thing: ts.Symbol | ts.Declaration | ts.Type | ts.Node
): thing is ts.Type {
  return !!(thing as ts.Type).getBaseTypes && !!(thing as ts.Type).isUnion;
}

/**
 * Check to see whether a value is a ts.Symbol
 * @param thing value to check
 */
export function isSymbol(
  thing: ts.Symbol | ts.Declaration | ts.Type | ts.Node
): thing is ts.Symbol {
  return !!(thing as any).escapedName;
}

/**
 * Check to see whether a value is a ts.Node
 * @param thing value to check
 */
export function isNode(
  thing: ts.Symbol | ts.Declaration | ts.Type | ts.Node
): thing is ts.Node {
  return !!(thing as any).kind;
}
