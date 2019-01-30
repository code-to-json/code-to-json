import { refId } from '@code-to-json/utils';
import {
  flagsToString,
  isDeclaration,
  isDeclarationExported,
  nameForNode,
} from '@code-to-json/utils-ts';
import * as ts from 'typescript';
import { DeclarationRef, NodeRef, SourceFileRef } from '../types/ref';
import { SerializedNode } from '../types/serialized-entities';
import { Collector } from '../types/walker';
import serializeLocation from './location';

/**
 * Serialize a ts.Node to a POJO
 *
 * @param n Node to serialize
 * @param checker type-checker
 * @param ref reference being used to represent the serialized node
 * @param c walker collector
 */
export default function serializeNode(
  n: ts.Node,
  checker: ts.TypeChecker,
  ref: NodeRef | DeclarationRef | SourceFileRef,
  _related: undefined | ts.Node[],
  c: Collector,
): SerializedNode {
  const { flags, kind, decorators, modifiers, pos, end } = n;
  const { queue: q } = c;
  const details: SerializedNode = {
    id: refId(ref),
    entity: 'node',
    location: serializeLocation(n.getSourceFile(), pos, end, q),
    name: nameForNode(n, checker),
    text: n.getText(),
    isExposed: isDeclaration(n) && isDeclarationExported(n),
    isExported: !!(
      modifiers &&
      modifiers.length &&
      modifiers.map(m => m.kind).indexOf(ts.SyntaxKind.ExportKeyword) >= 0
    ),
    kind: ts.SyntaxKind[kind],
    flags: flagsToString(flags, 'node'),
  };

  if (decorators && decorators.length) {
    details.decorators = decorators.map(d => ts.SyntaxKind[d.kind]);
  }
  if (modifiers && modifiers.length) {
    details.modifiers = modifiers.map(d => ts.SyntaxKind[d.kind]);
  }

  return details;
}
