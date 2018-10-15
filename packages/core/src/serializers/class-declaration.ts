import * as ts from 'typescript';
import { WalkData, SerializedClassDeclaration } from '../types';
import serializeBaseNode from './base';
import serializeType from './type';

export default function serializeClassDeclaration(
  node: ts.ClassDeclaration,
  checker: ts.TypeChecker,
  walkData: WalkData
): SerializedClassDeclaration {
  const { name } = node;
  let typ: ts.Type = checker.getTypeAtLocation(name || node);
  return {
    ...serializeBaseNode(node, checker, walkData),
    name: name && name.text,
    typeId: serializeType(typ, checker, walkData).id
  };
}
