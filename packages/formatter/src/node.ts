import { SerializedNode, WalkerOutputData } from '@code-to-json/core';
import { DataCollector } from './data-collector';
import { FormattedNode, FormattedNodeRef } from './types';
import { convertLocation } from './location';

export default function formatNode(
  wo: WalkerOutputData,
  nod: Readonly<SerializedNode>,
  _ref: FormattedNodeRef,
  collector: DataCollector,
): FormattedNode {
  const { id, syntaxKind, text, name, flags, location, entity } = nod;

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
