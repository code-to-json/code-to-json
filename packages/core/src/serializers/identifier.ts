import * as ts from 'typescript';
import serializeBaseNode from './base';
import { WalkData, SerializedBaseNode } from '../types';

export default function serializeIdentifier(
  identifier: ts.Identifier,
  checker: ts.TypeChecker,
  walkData: WalkData
): SerializedBaseNode<ts.SyntaxKind.Identifier> {
  return {
    ...serializeBaseNode(identifier, checker, walkData)
  };
}
