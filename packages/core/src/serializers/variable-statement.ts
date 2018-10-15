import * as ts from 'typescript';
import {
  WalkData,
  SerializedVariableStatement,
  SerializedVariableDeclaration
} from '../types';
import serializeBaseNode from './base';
import serializeType from './type';

export default function serializeVariableStatement(
  node: ts.VariableStatement,
  checker: ts.TypeChecker,
  walkData: WalkData
): SerializedVariableStatement {
  return {
    ...serializeBaseNode(node, checker, walkData),
    declarations: serializeVariableDeclarationList(
      node.declarationList,
      checker,
      walkData
    )
  };
}

function serializeVariableDeclarationList(
  node: ts.VariableDeclarationList,
  checker: ts.TypeChecker,
  walkData: WalkData
): SerializedVariableDeclaration[] {
  return node.declarations.map(d => {
    const typ = checker.getTypeAtLocation(d.name);
    return {
      ...serializeBaseNode(d, checker, walkData),
      name: d.name.getText(),
      typeId: serializeType(typ, checker, walkData).id
    };
  });
}
