import { refId } from '@code-to-json/utils';
import { isDeclaration, isDeclarationExported, isNamedDeclaration } from '@code-to-json/utils-ts';
import { isVariableStatement, Node, SyntaxKind, TypeChecker } from 'typescript';
import { flagsToString } from '../flags';
import { ProcessingQueue } from '../processing-queue';
import { DeclarationRef, NodeRef, SourceFileRef } from '../processing-queue/ref';
import { HasPosition, SerializedEntity } from '../types';
import serializeLocation from './location';

export interface SerializedNode<TYP extends string = 'node'>
  extends SerializedEntity<TYP>,
    HasPosition {
  text: string;
  kind: string;
  decorators?: string[];
  modifiers?: string[];
  isExposed: boolean;
  isExported: boolean;
  // parent?: NodeRef;
  // children?: NodeRef[];
  // type?: TypeRef;
}

function nameForNode(n: Node, checker: TypeChecker): string {
  const name = isNamedDeclaration(n) && n.name;
  const sym = checker.getSymbolAtLocation(name || n);
  if (sym && name) {
    return name.getText();
  }
  if (isVariableStatement(n)) {
    return `${n.declarationList.declarations.length}`;
  }
  return '(unknown)';
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
  q: ProcessingQueue,
): SerializedNode {
  const { flags, kind, decorators, modifiers, pos, end } = n;

  const details: SerializedNode = {
    id: refId(ref),
    entity: 'node',
    location: serializeLocation(n.getSourceFile(), pos, end),
    name: nameForNode(n, checker),
    text: n.getText(),
    isExposed: isDeclaration(n) && isDeclarationExported(n),
    isExported: !!(
      modifiers &&
      modifiers.length &&
      modifiers.map(m => m.kind).indexOf(SyntaxKind.ExportKeyword) >= 0
    ),
    sourceFile: q.queue(n.getSourceFile(), 'sourceFile', checker),
    kind: SyntaxKind[kind],
    flags: flagsToString(flags, 'node'),
  };

  if (decorators && decorators.length) {
    details.decorators = decorators.map(d => SyntaxKind[d.kind]);
  }
  if (modifiers && modifiers.length) {
    details.modifiers = modifiers.map(d => SyntaxKind[d.kind]);
  }
  // tslint:disable-next-line:no-commented-code
  // if (parent) {
  //   details.parent = q.queue(parent, 'node', checker);
  // }
  // let typ: Type | undefined;
  // const sym = checker.getSymbolAtLocation(name || n);
  // if (sym && name) {
  //   details.name = name.getText();
  //   typ = checker.getTypeOfSymbolAtLocation(sym, name);
  // }
  // if (typ) {
  //   details.type = q.queue(typ, 'type', checker);
  // }
  // const childReferences = mapChildren(n, child => {
  //   if (
  //     !child.getSourceFile().isDeclarationFile &&
  //     isDeclaration(child) &&
  //     isDeclarationExported(child)
  //   ) {
  //     return q.queue(child, 'node', checker);
  //   }
  //   return;
  // }).filter(isRef);
  // if (childReferences && childReferences.length > 0) {
  //   details.children = childReferences;
  // }
  return details;
}
