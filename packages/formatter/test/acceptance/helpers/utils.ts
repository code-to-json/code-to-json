import { AnyRef, refId, refType, UnreachableError } from '@code-to-json/utils';
import {
  FormattedSourceFile,
  FormattedSourceFileRef,
  FormattedSymbol,
  FormattedSymbolRef,
  FormattedType,
  FormattedTypeRef,
  FormatterOutputData,
  FormatterRefRegistry,
} from '../../../src';

export default function resolveReference(
  wo: FormatterOutputData,
  ref: FormattedSymbolRef,
): FormattedSymbol;
export default function resolveReference(
  wo: FormatterOutputData,
  ref: FormattedTypeRef,
): FormattedType;

// export default function resolveReference(
//   wo: FormatterOutputData,
//   ref: FormattedDeclarationRef,
// ): FormattedDeclaration;
// export default function resolveReference(wo: FormatterOutputData, ref: FormattedNodeRef): FormattedNode;
export default function resolveReference(
  wo: FormatterOutputData,
  ref: FormattedSourceFileRef,
): FormattedSourceFile;
export default function resolveReference(
  wo: FormatterOutputData,
  ref: AnyRef<FormatterRefRegistry>,
): any {
  const refTyp = refType(ref);
  const id = refId(ref);
  switch (refTyp) {
    case 't':
      return wo.types[id];
    case 'n':
      return wo.nodes[id];
    case 'd':
      return wo.declarations[id];
    case 'f':
      return wo.sourceFiles[id];
    case 's':
      return wo.symbols[id];

    default:
      throw new UnreachableError(refTyp, `reference type: ${refTyp}`);
  }
}
