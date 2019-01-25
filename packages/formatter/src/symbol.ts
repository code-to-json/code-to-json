import { SerializedSymbol, WalkerOutputData } from '@code-to-json/core';
import { conditionallyMergeTransformed, refId } from '@code-to-json/utils';
import { isString } from 'util';
import { DataCollector } from './data-collector';
import { mapDecorator } from './decorator';
import formatFlags from './flags';
import { mapModifier } from './modifiers';
import resolveReference from './resolve-reference';
import { FormattedSymbol, FormattedSymbolRef } from './types';
import { formatSymbolRefMap } from './utils';

export default function formatSymbol(
  wo: WalkerOutputData,
  symbol: Readonly<SerializedSymbol>,
  ref: FormattedSymbolRef,
  collector: DataCollector,
): FormattedSymbol {
  const {
    name,
    flags: _rawFlags,
    exports,
    type,
    modifiers,
    decorators,
    heritageClauses,
    location,
    comment,
    members,
    sourceFile,
    jsDocTags,
    globalExports,
    external,
    documentation,
    symbolString,
  } = symbol;
  const info: FormattedSymbol = {
    id: refId(ref),
    name: name || '(anonymous)',
  };
  if (symbolString) {
    info.text = symbolString;
  }
  if (comment) {
    info.comment = comment;
  }
  if (location) {
    info.location = location;
  }
  if (external) {
    info.external = external;
  }
  if (jsDocTags) {
    info.jsDocTags = jsDocTags;
  }
  if (sourceFile) {
    info.sourceFile = collector.queue(resolveReference(wo, sourceFile), 'f');
  }
  if (type) {
    info.type = collector.queue(resolveReference(wo, type), 't');
  }
  conditionallyMergeTransformed(info, documentation, 'documentation', d => d);
  conditionallyMergeTransformed(info, heritageClauses, 'heritageClauses', hc =>
    hc.map(h => h.clauseType),
  );
  conditionallyMergeTransformed(info, modifiers, 'modifiers', list =>
    list.filter(isString).map(mapModifier),
  );
  conditionallyMergeTransformed(info, decorators, 'decorators', list =>
    list.filter(isString).map(mapDecorator),
  );
  conditionallyMergeTransformed(
    info,
    _rawFlags,
    'flags',
    f => formatFlags(f),
    f => !!(f && f.length > 0),
  );

  conditionallyMergeTransformed(
    info,
    exports,
    'exports',
    ex => formatSymbolRefMap(ex, wo, collector),
    ex => !!(ex && Object.keys(ex).length > 0),
  );
  conditionallyMergeTransformed(
    info,
    globalExports,
    'globalExports',
    ex => formatSymbolRefMap(ex, wo, collector),
    ex => !!(ex && Object.keys(ex).length > 0),
  );
  conditionallyMergeTransformed(
    info,
    members,
    'members',
    mem => formatSymbolRefMap(mem, wo, collector),
    mem => !!(mem && Object.keys(mem).length > 0),
  );

  return info;
}
