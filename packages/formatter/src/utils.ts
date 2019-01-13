import { SymbolRef, TypeRef, WalkerOutputData } from '@code-to-json/core';
import { isRef } from '@code-to-json/utils';
import { DataCollector } from './data-collector';
import resolveReference from './resolve-reference';
import { FormattedSymbolRef, FormattedTypeRef } from './types';

export function symbolRefListToFormattedSymbolMap(
  list: SymbolRef[],
  wo: WalkerOutputData,
  collector: DataCollector,
): { [k: string]: FormattedSymbolRef | undefined } {
  return list.filter(isRef).reduce(
    (syms, s) => {
      const exp = resolveReference(wo, s);
      if (!exp) { return syms; }
      const { name: expName } = exp;
      // eslint-disable-next-line no-param-reassign
      syms[expName] = collector.queue(exp, 's');
      return syms;
    },
    {} as { [k: string]: FormattedSymbolRef | undefined },
  );
}
