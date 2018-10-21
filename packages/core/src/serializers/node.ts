import { Flags, flagsToString, mapChildren } from '@code-to-json/utils';
import { isNamedDeclaration } from '@code-to-json/utils/lib/guards';
import * as ts from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import {
  DeclarationRef,
  isRef,
  NodeRef,
  SourceFileRef,
  TypeRef
} from '../processing-queue/ref';

export interface SerializedNode {
  thing: 'node';
  id: string;
  flags?: Flags;
  parent?: NodeRef;
  children?: NodeRef[];
  kind: string;
  pos: number;
  end: number;
  name?: string;
  decorators?: string[];
  modifiers?: string[];
  type?: TypeRef;
}

export default function serializeNode(
  n: ts.Node,
  checker: ts.TypeChecker,
  ref: NodeRef | DeclarationRef | SourceFileRef,
  _queue: ProcessingQueue
): SerializedNode {
  const { flags, kind, decorators, modifiers, pos, end, parent } = n;
  const details: SerializedNode = {
    id: ref.id,
    pos,
    end,
    thing: 'node',
    kind: ts.SyntaxKind[kind],
    flags: flagsToString(flags, 'node')
  };
  if (decorators && decorators.length) {
    details.decorators = decorators.map((d) => ts.SyntaxKind[d.kind]);
  }
  if (modifiers && modifiers.length) {
    details.modifiers = modifiers.map((d) => ts.SyntaxKind[d.kind]);
  }
  if (parent) {
    details.parent = _queue.queue(parent, 'node', checker);
  }
  const name = isNamedDeclaration(n) && n.name;
  let typ: ts.Type | undefined;
  const sym = checker.getSymbolAtLocation(name || n);
  if (sym && name) {
    details.name = name.getText();
    typ = checker.getTypeOfSymbolAtLocation(sym, name);
  }
  if (typ) {
    details.type = _queue.queue(typ, 'type', checker);
  }
  const childReferences = mapChildren(n, (child) => {
    if (child.getSourceFile().isDeclarationFile) {
      return;
    }
    return _queue.queue(child, 'node', checker);
  }).filter(isRef);
  if (childReferences && childReferences.length > 0) {
    details.children = childReferences;
  }
  return details;
}
