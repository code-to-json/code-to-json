import * as ts from 'typescript';
import { SerializedSourceFile, WalkData, SerializedBaseNode } from '../types';
import { mapChildren, flagsToString } from '@code-to-json/utils';
import serializeNode from './node';
import serializeBaseNode from './base';

export default function serializeSourceFile(
  node: ts.SourceFile,
  checker: ts.TypeChecker,
  walkData: WalkData
): SerializedSourceFile {
  const {
    languageVariant,
    languageVersion,
    fileName,
    isDeclarationFile
  } = node;
  let serialized = {
    ...serializeBaseNode(node, checker, walkData),
    fileName: fileName,
    languageVariant: languageVariant.toString(),
    languageVersion: !!languageVersion ? languageVersion.toString() : undefined,
    isDeclarationFile: isDeclarationFile
  };

  const children = mapChildren(
    node,
    child =>
      serializeNode(child, checker, walkData) as SerializedBaseNode<
        ts.SyntaxKind
      >
  ).filter(Boolean);

  return { ...serialized, children };
}
