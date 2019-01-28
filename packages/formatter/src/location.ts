import { SerializedCodeRange, WalkerOutputData } from '@code-to-json/core';
import { DataCollector } from './data-collector';
import resolveReference from './resolve-reference';
import { CodeRange } from './types';

export function convertLocation(
  wo: WalkerOutputData,
  dc: DataCollector,
  loc: SerializedCodeRange,
): CodeRange {
  const [fileRef, a, b, c, d] = loc;
  return [dc.queue(resolveReference(wo, fileRef), 'f')!, a, b, c, d];
}
