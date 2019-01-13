import { SerializedSymbol, SymbolRef, WalkerOutputData } from '@code-to-json/core';
import { conditionallyMergeTransformed, isRef } from '@code-to-json/utils';
import { DataCollector } from './data-collector';
import formatFlags from './flags';
import resolveReference from './resolve-reference';
import formatSignature from './signature';
import { FormattedSymbol, FormattedSymbolRef, SideloadedDataCollector } from './types';
import { symbolRefListToFormattedSymbolMap } from './utils';

function isObject<T extends object>(v?: T): v is T {
  return typeof v !== 'undefined' && typeof v === 'object';
}

export default function formatSymbol(
  wo: WalkerOutputData,
  symbol: Readonly<SerializedSymbol>,
  collector: DataCollector,
): FormattedSymbol {
  const {
    name,
    flags: _rawFlags,
    exports,
    members,
    // jsDocTags,
    callSignatures,
    type,
    modifiers,
    decorators,
    heritageClauses,
    // location,
    constructorSignatures,
    documentation,
  } = symbol;
  const info: FormattedSymbol = {
    name: name || '(anonymous)',
    // jsDocTags
  };
  if (type) {
    info.type = collector.queue(resolveReference(wo, type), 't');
  }
  conditionallyMergeTransformed(info, documentation, 'documentation', d => d);
  conditionallyMergeTransformed(info, heritageClauses, 'heritageClauses', hc =>
    hc.map(h => h.clauseType),
  );
  conditionallyMergeTransformed(info, modifiers, 'modifiers', d => d);
  conditionallyMergeTransformed(info, decorators, 'decorators', d => d);
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
    ex => symbolRefListToFormattedSymbolMap(ex, wo, collector),
    ex => !!(ex && ex.length > 0),
  );
  conditionallyMergeTransformed(
    info,
    members,
    'members',
    mem => symbolRefListToFormattedSymbolMap(mem, wo, collector),
    mem => !!(mem && mem.length > 0),
  );
  conditionallyMergeTransformed(
    info,
    callSignatures,
    'callSignatures',
    cs => cs.map(s => formatSignature(wo, s, collector)),
    cs => cs && cs.length > 0,
  );
  conditionallyMergeTransformed(
    info,
    constructorSignatures,
    'constructorSignatures',
    cs => cs.map(s => formatSignature(wo, s, collector)),
    cs => cs && cs.length > 0,
  );

  return info;
}
