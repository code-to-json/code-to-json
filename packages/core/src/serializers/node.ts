import * as ts from 'typescript';
import * as tg from 'tsutils/typeguard';

import serializeSourceFile from './sourcefile';
import { WalkData, SerializedBaseNode } from '../types';
import serializeImportDeclaration from './import-declaration';
import serializeFunctionDeclaration from './function-declaration';
import serializeClassDeclaration from './class-declaration';
import serializeVariableStatement from './variable-statement';

export default function serializeNode(
  node: ts.Node,
  checker: ts.TypeChecker,
  walkData: WalkData
): SerializedBaseNode<ts.SyntaxKind> | null {
  if (tg.isSourceFile(node))
    return serializeSourceFile(node, checker, walkData);
  else if (tg.isImportDeclaration(node))
    return serializeImportDeclaration(node, checker, walkData);
  else if (ts.isFunctionDeclaration(node))
    return serializeFunctionDeclaration(node, checker, walkData);
  else if (ts.isVariableStatement(node))
    return serializeVariableStatement(node, checker, walkData);
  else if (ts.isClassDeclaration(node))
    return serializeClassDeclaration(node, checker, walkData);
  else if (node.kind === ts.SyntaxKind.EndOfFileToken) {
    return null;
  } else {
    debugger;
    throw new Error(
      `Unexpected node kind ${node.kind} (${ts.SyntaxKind[node.kind]})`
    );
  }
}
