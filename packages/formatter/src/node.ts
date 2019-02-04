import { SerializedNode, WalkerOutputData } from '@code-to-json/core';
import { DataCollector } from './data-collector';
import { FormattedNode, FormattedNodeRef } from './types';

export default function formatNode(
  _wo: WalkerOutputData,
  decl: Readonly<SerializedNode>,
  _ref: FormattedNodeRef,
  _collector: DataCollector,
): FormattedNode {
  return {
    id: decl.id,
    kind: 'node',
  };
}
