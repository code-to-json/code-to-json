import { isDeclarationExported, mapChildren } from '@code-to-json/utils';
import { isRef, refId } from '@code-to-json/utils/lib/deferred-processing/ref';
import { isDeclaration, isNamedDeclaration } from '@code-to-json/utils/lib/guards';
import { Node, SyntaxKind, Type, TypeChecker } from 'typescript';
import { Flags, flagsToString } from '../flags';
import { ProcessingQueue } from '../processing-queue';
import { DeclarationRef, NodeRef, SourceFileRef, TypeRef } from '../processing-queue/ref';

export interface SerializedNode {
  thing: 'node';
  id: string;
  flags?: Flags;
  parent?: NodeRef;
  children?: NodeRef[];
  kind: string;
  pos: number;
  end: number;
  text: string;
  sourceFile?: SourceFileRef;
  name?: string;
  decorators?: string[];
  modifiers?: string[];
  type?: TypeRef;
}

/**
 * Serialize a Node to a POJO
 * @param n Node to serialize
 */
// tslint:disable-next-line:cognitive-complexity
export default function serializeNode(
  n: Node,
  checker: TypeChecker,
  ref: NodeRef | DeclarationRef | SourceFileRef,
  q: ProcessingQueue
): SerializedNode {
  const { flags, kind, decorators, modifiers, pos, end, parent } = n;

  const details: SerializedNode = {
    id: refId(ref),
    pos,
    end,
    text: n.getText(),
    sourceFile: q.queue(n.getSourceFile(), 'sourceFile', checker),
    thing: 'node',
    kind: SyntaxKind[kind],
    flags: flagsToString(flags, 'node')
  };
  if (decorators && decorators.length) {
    details.decorators = decorators.map(d => SyntaxKind[d.kind]);
  }
  if (modifiers && modifiers.length) {
    details.modifiers = modifiers.map(d => SyntaxKind[d.kind]);
  }
  if (parent) {
    details.parent = q.queue(parent, 'node', checker);
  }
  const name = isNamedDeclaration(n) && n.name;
  let typ: Type | undefined;
  const sym = checker.getSymbolAtLocation(name || n);
  if (sym && name) {
    details.name = name.getText();
    typ = checker.getTypeOfSymbolAtLocation(sym, name);
  }
  if (typ) {
    details.type = q.queue(typ, 'type', checker);
  }
  const childReferences = mapChildren(n, child => {
    if (child.getSourceFile().isDeclarationFile) {
      return;
    }
    if (isDeclaration(child) && isDeclarationExported(child)) {
      return q.queue(child, 'node', checker);
    } else {
      return undefined;
    }
  }).filter(isRef);
  if (childReferences && childReferences.length > 0) {
    details.children = childReferences;
  }
  return details;
}
