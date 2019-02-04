import { SerializedDeclaration, WalkerOutputData } from '@code-to-json/core';
import { DataCollector } from './data-collector';
import { FormattedDeclaration, FormattedDeclarationRef } from './types';

export default function formatDeclaration(
  _wo: WalkerOutputData,
  decl: Readonly<SerializedDeclaration>,
  _ref: FormattedDeclarationRef,
  _collector: DataCollector,
): FormattedDeclaration {
  return {
    id: decl.id,
    kind: 'declaration',
  };
}
