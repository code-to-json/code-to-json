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
  ObjectType,
  Symbol as Sym,
  SyntaxKind,
  Type,
  TypeFlags,
} from 'typescript';

const DECLARATION_KINDS = [
  SyntaxKind.SourceFile,
  SyntaxKind.ArrowFunction,
  SyntaxKind.BindingElement,
  SyntaxKind.ClassDeclaration,
  SyntaxKind.ClassExpression,
  SyntaxKind.Constructor,
  SyntaxKind.EnumDeclaration,
  SyntaxKind.EnumMember,
  SyntaxKind.ExportSpecifier,
  SyntaxKind.FunctionDeclaration,
  SyntaxKind.FunctionExpression,
  SyntaxKind.GetAccessor,
  SyntaxKind.ImportClause,
  SyntaxKind.ImportEqualsDeclaration,
  SyntaxKind.ImportSpecifier,
  SyntaxKind.InterfaceDeclaration,
  SyntaxKind.JsxAttribute,
  SyntaxKind.MethodDeclaration,
  SyntaxKind.MethodSignature,
  SyntaxKind.ModuleDeclaration,
  SyntaxKind.NamespaceExportDeclaration,
  SyntaxKind.NamespaceImport,
  SyntaxKind.Parameter,
  SyntaxKind.PropertyAssignment,
  SyntaxKind.PropertyDeclaration,
  SyntaxKind.PropertySignature,
  SyntaxKind.SetAccessor,
  SyntaxKind.ShorthandPropertyAssignment,
  SyntaxKind.TypeAliasDeclaration,
  SyntaxKind.TypeParameter,
  SyntaxKind.VariableDeclaration,
  SyntaxKind.JSDocTypedefTag,
  SyntaxKind.JSDocCallbackTag,
  SyntaxKind.JSDocPropertyTag,
];

/**
 * Returns true if the specified SyntaxKind is part of a declaration form.
 *
 * Based on isDeclarationKind() from the compiler.
 * https://github.com/Microsoft/TypeScript/blob/v3.0.3/src/compiler/utilities.ts#L6382
 */
function isDeclarationKind(kind: SyntaxKind): boolean {
  return DECLARATION_KINDS.indexOf(kind) >= 0;
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

export type TypeIsh = Sym | Type | Node;
/**
 * Check to see whether a value is a Type
 * @param thing value to check
 */
export function isType(thing?: TypeIsh): thing is Type {
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

/**
 * Check whether a Type is an ObjectType
 * @param type ts.Type
 */
export function isObjectType(type: Type): type is ObjectType {
  // tslint:disable-next-line:no-bitwise
  return !!(type.flags & TypeFlags.Object);
}
