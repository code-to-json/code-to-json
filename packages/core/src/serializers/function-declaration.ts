import * as ts from 'typescript';
import { WalkData, SerializedFunctionDeclaration } from '../types';
import serializeBaseNode from './base';
import serializeType from './type';

export default function serializeFunctionDeclaration(
  node: ts.FunctionDeclaration,
  checker: ts.TypeChecker,
  walkData: WalkData
): SerializedFunctionDeclaration {
  const { name, type: typeNode } = node;
  let typ: ts.Type;
  if (name) {
    typ = checker.getTypeAtLocation(name);
  } else if (typeNode) {
    typ = checker.getTypeFromTypeNode(typeNode);
  } else {
    throw new Error(`Could not determine type of function \n${node.getText()}`);
  }
  return {
    ...serializeBaseNode(node, checker, walkData),
    name: name && name.text,
    typeId: serializeType(typ, checker, walkData).id
  };
}
