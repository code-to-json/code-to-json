import {
  Declaration,
  isClassLike,
  isFunctionLike,
  isObjectLiteralElement,
  isParameter,
  isPropertyDeclaration,
  isTypeParameterDeclaration,
  isVariableDeclaration,
  NamedDeclaration,
  Node,
  Symbol as Sym,
  SyntaxKind,
  Type
} from 'typescript';

/**
 * Returns true if the specified SyntaxKind is part of a declaration form.
 *
 * Based on isDeclarationKind() from the compiler.
 * https://github.com/Microsoft/TypeScript/blob/v3.0.3/src/compiler/utilities.ts#L6382
 */
function isDeclarationKind(kind: SyntaxKind): boolean {
  return (
    kind === SyntaxKind.SourceFile ||
    kind === SyntaxKind.ArrowFunction ||
    kind === SyntaxKind.BindingElement ||
    kind === SyntaxKind.ClassDeclaration ||
    kind === SyntaxKind.ClassExpression ||
    kind === SyntaxKind.Constructor ||
    kind === SyntaxKind.EnumDeclaration ||
    kind === SyntaxKind.EnumMember ||
    kind === SyntaxKind.ExportSpecifier ||
    kind === SyntaxKind.FunctionDeclaration ||
    kind === SyntaxKind.FunctionExpression ||
    kind === SyntaxKind.GetAccessor ||
    kind === SyntaxKind.ImportClause ||
    kind === SyntaxKind.ImportEqualsDeclaration ||
    kind === SyntaxKind.ImportSpecifier ||
    kind === SyntaxKind.InterfaceDeclaration ||
    kind === SyntaxKind.JsxAttribute ||
    kind === SyntaxKind.MethodDeclaration ||
    kind === SyntaxKind.MethodSignature ||
    kind === SyntaxKind.ModuleDeclaration ||
    kind === SyntaxKind.NamespaceExportDeclaration ||
    kind === SyntaxKind.NamespaceImport ||
    kind === SyntaxKind.Parameter ||
    kind === SyntaxKind.PropertyAssignment ||
    kind === SyntaxKind.PropertyDeclaration ||
    kind === SyntaxKind.PropertySignature ||
    kind === SyntaxKind.SetAccessor ||
    kind === SyntaxKind.ShorthandPropertyAssignment ||
    kind === SyntaxKind.TypeAliasDeclaration ||
    kind === SyntaxKind.TypeParameter ||
    kind === SyntaxKind.VariableDeclaration ||
    kind === SyntaxKind.JSDocTypedefTag ||
    kind === SyntaxKind.JSDocCallbackTag ||
    kind === SyntaxKind.JSDocPropertyTag
  );
}

/**
 * Check to see whether a value is a named declaration
 * @param node value to check
 */
export function isNamedDeclaration(node?: Node): node is NamedDeclaration {
  return (
    !!node &&
    (isClassLike(node) ||
      isFunctionLike(node) ||
      isTypeParameterDeclaration(node) ||
      isParameter(node) ||
      isObjectLiteralElement(node) ||
      isPropertyDeclaration(node) ||
      isVariableDeclaration(node))
  );
}

/**
 * Check to see whether a value is a Declaration
 * @param node value to check
 */
export function isDeclaration(node?: Node | Declaration): node is Declaration {
  return !!node && isDeclarationKind(node.kind);
}

/**
 * Check to see whether a value is a Type
 * @param thing value to check
 */
export function isType(thing?: Sym | Type | Node): thing is Type {
  return !!thing && !!(thing as Type).getBaseTypes && !!(thing as Type).isUnion;
}

/**
 * Check to see whether a value is a Symbol
 * @param thing value to check
 */
export function isSymbol(thing?: Sym | Type | Node): thing is Sym {
  return !!thing && typeof (thing as Sym).getEscapedName === 'function';
}

/**
 * Check to see whether a value is a Node
 * @param thing value to check
 */
export function isNode(thing?: Sym | Type | Node): thing is Node {
  return !!thing && typeof (thing as Node).getChildAt === 'function';
}
