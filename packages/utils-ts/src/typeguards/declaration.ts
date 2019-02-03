import * as ts from 'typescript';

/**
 * Check to see whether a value is a named declaration
 * @param node value to check
 */
export function isNamedDeclaration(node?: ts.Node): node is ts.NamedDeclaration {
  return (
    !!node &&
    (ts.isClassLike(node) ||
      ts.isFunctionLike(node) ||
      ts.isTypeParameterDeclaration(node) ||
      ts.isParameter(node) ||
      ts.isObjectLiteralElement(node) ||
      ts.isPropertyDeclaration(node) ||
      ts.isVariableDeclaration(node))
  );
}
