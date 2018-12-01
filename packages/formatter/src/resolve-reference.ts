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
  WalkerOutputData
} from '@code-to-json/core';
import { AnyRef, refId, refType, UnreachableError } from '@code-to-json/utils';

export default function resolveReference(wo: WalkerOutputData, ref: SymbolRef): SerializedSymbol;
export default function resolveReference(wo: WalkerOutputData, ref: TypeRef): SerializedType;
export default function resolveReference(
  wo: WalkerOutputData,
  ref: DeclarationRef
): SerializedDeclaration;
export default function resolveReference(wo: WalkerOutputData, ref: NodeRef): SerializedNode;
export default function resolveReference(
  wo: WalkerOutputData,
  ref: SourceFileRef
): SerializedSourceFile;
export default function resolveReference(wo: WalkerOutputData, ref: AnyRef): any {
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
