/* eslint-disable import/prefer-default-export */
import * as ts from 'typescript';
import { isNamedDeclaration } from './guards';

/**
 * Map over a TypeScript AST node's children
 * @param node parent node
 * @param mapper mapping function to apply to each child
 */
export function mapChildren<T>(node: ts.Node, mapper: (child: ts.Node) => T): T[] {
  const arr: T[] = [];
  ts.forEachChild(node, (child: ts.Node) => {
    arr.push(mapper(child));
  });
  return arr;
}

/**
 * Obtain the name of a node
 * @param n Node whose name is desired
 * @param checker type-checker
 */
export function nameForNode(n: ts.Node, checker: ts.TypeChecker): string {
  const name = isNamedDeclaration(n) && n.name;
  const sym = checker.getSymbolAtLocation(name || n);
  if (sym && name) {
    return name.getText();
  }
  if (ts.isVariableStatement(n)) {
    return `${n.declarationList.declarations.length}`;
  }
  return '(unknown)';
}
