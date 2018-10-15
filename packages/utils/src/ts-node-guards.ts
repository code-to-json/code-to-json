import * as ts from 'typescript';
import { isDeclarationKind } from './syntax';

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

export function isDeclaration(node: ts.Node): node is ts.Declaration {
  return isDeclarationKind(node.kind);
}

/** True if this is visible outside this file, false otherwise */
export function isExported(node: ts.Node): node is ts.Declaration {
  return (
    (isDeclaration(node) &&
      ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  );
}
