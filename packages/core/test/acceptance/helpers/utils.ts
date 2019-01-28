import { AnyRef, refId, refType, UnreachableError } from '@code-to-json/utils';
import {
  DeclarationRef,
  NodeRef,
  RefRegistry,
  SerializedDeclaration,
  SerializedNode,
  SerializedSourceFile,
  SerializedSymbol,
  SerializedType,
  SourceFileRef,
  SymbolRef,
  TypeRef,
  WalkerOutputData,
} from '../../../src';

export default function resolveReference(wo: WalkerOutputData, ref: SymbolRef): SerializedSymbol;
export default function resolveReference(wo: WalkerOutputData, ref: TypeRef): SerializedType;
export default function resolveReference(
  wo: WalkerOutputData,
  ref: DeclarationRef,
): SerializedDeclaration;
export default function resolveReference(wo: WalkerOutputData, ref: NodeRef): SerializedNode;
export default function resolveReference(
  wo: WalkerOutputData,
  ref: SourceFileRef,
): SerializedSourceFile;
export default function resolveReference(wo: WalkerOutputData, ref: AnyRef<RefRegistry>): any {
  const refTyp = refType(ref);
  const id = refId(ref);
  switch (refTyp) {
    case 'type':
      return wo.types[id];
    case 'node':
      return wo.nodes[id];
    case 'declaration':
      return wo.declarations[id];
    case 'sourceFile':
      return wo.sourceFiles[id];
    case 'symbol':
      return wo.symbols[id];
    default:
      throw new UnreachableError(refTyp, `reference type: ${refTyp}`);
  }
}
