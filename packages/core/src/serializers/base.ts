import * as ts from 'typescript';
import { WalkData, SerializedBaseNode, SerializedEnum } from '../types';
import { flagsToString } from '@code-to-json/utils';

export default function serializeBaseNode<K extends ts.SyntaxKind>(
  node: ts.Node & { kind: K },
  _checker: ts.TypeChecker,
  _walkData: WalkData
): SerializedBaseNode<K> {
  const { kind, modifiers, decorators, flags, pos, end } = node;
  const sym = _checker.getSymbolAtLocation(node);
  let symbolFlags: string | string[] | null = null;
  if (sym) {
    symbolFlags = flagsToString(sym.flags, ts.SymbolFlags as any);
  }
  const out: SerializedBaseNode<K> = {
    kind: serializeSyntaxKind(kind),
    pos,
    end,
    symbolFlags,
    flags: flagsToString(node.flags, ts.NodeFlags as any)
  };
  if (modifiers) {
    out.modifiers = modifiers.map(m => ts.SyntaxKind[m.kind]).filter(Boolean);
  }
  if (decorators) {
    out.decorators = decorators.map(m => ts.SyntaxKind[m.kind]).filter(Boolean);
  }
  return out;
}

export function serializeSyntaxKind<K extends ts.SyntaxKind>(
  kind: K
): SerializedEnum<K> {
  return {
    value: kind,
    text: ts.SyntaxKind[kind as number]
  };
}

export function serializeModifier(modifier: ts.Modifier) {
  return ts.SyntaxKind[modifier.kind];
}

export function serializeDecorator(decorator: ts.Modifier) {
  return ts.SyntaxKind[decorator.kind];
}
