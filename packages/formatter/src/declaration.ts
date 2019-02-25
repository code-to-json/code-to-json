import { SerializedDeclaration, WalkerOutputData } from '@code-to-json/core';
import { DataCollector } from './data-collector';
import { FormattedDeclaration, FormattedDeclarationRef } from './types';
import { convertLocation } from './location';

export default function formatDeclaration(
  wo: WalkerOutputData,
  decl: Readonly<SerializedDeclaration>,
  _ref: FormattedDeclarationRef,
  collector: DataCollector,
): FormattedDeclaration {
  const { id, syntaxKind, text, name, flags, location, entity } = decl;
  return {
    id,
    name,
    syntaxKind,
    text,
    flags,
    location: location ? convertLocation(wo, collector, location) : undefined,
    kind: entity,
  };
}
