import { SymbolRef, TypeRef, WalkerOutputData } from '@code-to-json/core';
import { isRef } from '@code-to-json/utils';
import { filterDict, mapDict, reduceDict } from '@code-to-json/utils-ts';
import { Dict } from '@mike-north/types';
import { DataCollector } from './data-collector';
import resolveReference from './resolve-reference';
import { FormattedSymbolRef, FormattedTypeRef } from './types';

export function formatSymbolRefMap(
  symbols: Dict<SymbolRef>,
  wo: WalkerOutputData,
  collector: DataCollector,
): Dict<FormattedSymbolRef> {
  return reduceDict(
    symbols,
    (all, sRef) => {
      const exp = resolveReference(wo, sRef);
      if (!exp) {
        return all;
      }
      // eslint-disable-next-line no-param-reassign
      all[exp.name] = collector.queue(exp, 's');
      return all;
    },
    {} as Dict<FormattedSymbolRef>,
  );
}
