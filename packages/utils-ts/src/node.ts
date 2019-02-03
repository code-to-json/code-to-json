import * as ts from 'typescript';
import { isNamedDeclaration } from './typeguards';

/**
 * Obtain the name of a node
 * @param n Node whose name is desired
 * @param checker type-checker
 *
 * @private
 */
export function getNameForNode(n: ts.Node, checker: ts.TypeChecker): string {
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
