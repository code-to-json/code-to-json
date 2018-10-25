import {
  DeclarationRef,
  NodeRef,
  SerializedDeclaration,
  SerializedNode,
  SerializedSourceFile,
  SerializedSymbol,
  SerializedType,
  SourceFileRef,
  SymbolRef,
  TypeRef,
  WalkerOutput
} from '@code-to-json/core';
import { AnyRef, refId, refType, UnreachableError } from '@code-to-json/utils';

export default function resolveReference(wo: WalkerOutput, ref: SymbolRef): SerializedSymbol;
export default function resolveReference(wo: WalkerOutput, ref: TypeRef): SerializedType;
export default function resolveReference(
  wo: WalkerOutput,
  ref: DeclarationRef
): SerializedDeclaration;
export default function resolveReference(wo: WalkerOutput, ref: NodeRef): SerializedNode;
export default function resolveReference(
  wo: WalkerOutput,
  ref: SourceFileRef
): SerializedSourceFile;
export default function resolveReference(
  wo: WalkerOutput,
  // tslint:disable-next-line:max-union-size
  ref: AnyRef
): any {
  const refTyp = refType(ref);
  const id = refId(ref);
  switch (refTyp) {
    case 'type':
      return wo.type[id];
    case 'node':
      return wo.node[id];
    case 'declaration':
      return wo.declaration[id];
    case 'sourceFile':
      return wo.sourceFile[id];
    case 'symbol':
      return wo.symbol[id];
    default:
      throw new UnreachableError(refTyp);
  }
}
