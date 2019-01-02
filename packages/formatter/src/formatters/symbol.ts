import { SerializedSymbol, WalkerOutputData } from '@code-to-json/core';
import { conditionallyMergeTransformed } from '@code-to-json/utils';
import resolveReference from '../resolve-reference';
import formatFlags from './flags';
import formatSignature, { FormattedSignature } from './signature';

export interface FormattedSymbol {
  name: string;
  documentation?: string;
  flags?: string[];
  exports?: FormattedSymbol[];
  members?: FormattedSymbol[];
  jsDocTags?: Array<{ name: string; text?: string }>;
  callSignatures?: FormattedSignature[];
  constructorSignatures?: FormattedSignature[];
}

function isObject<T extends object>(v?: T): v is T {
  return typeof v !== 'undefined' && typeof v === 'object';
}

export default function formatSymbol(
  wo: WalkerOutputData,
  symbol: Readonly<SerializedSymbol>,
): FormattedSymbol {
  const {
    name,
    flags: _rawFlags,
    exports,
    members,
    // jsDocTags,
    callSignatures,
    constructorSignatures,
    documentation,
  } = symbol;
  const info: FormattedSymbol = {
    name: name || '(anonymous)',
    // jsDocTags
  };
  conditionallyMergeTransformed(info, documentation, 'documentation', d => d);
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
    ex =>
      ex
        .map(e => {
          const exp = resolveReference(wo, e);
          if (!exp) {
            return undefined;
          }
          return formatSymbol(wo, exp);
        })
        .filter(isObject),
    ex => !!(ex && ex.length > 0),
  );
  conditionallyMergeTransformed(
    info,
    members,
    'members',
    mem =>
      mem
        .map(m => {
          const exp = resolveReference(wo, m);
          if (!exp) {
            return undefined;
          }
          return formatSymbol(wo, exp);
        })
        .filter(isObject),
    mem => !!(mem && mem.length > 0),
  );
  conditionallyMergeTransformed(
    info,
    callSignatures,
    'callSignatures',
    cs => cs.map(s => formatSignature(wo, s)),
    cs => cs && cs.length > 0,
  );
  conditionallyMergeTransformed(
    info,
    constructorSignatures,
    'constructorSignatures',
    cs => cs.map(s => formatSignature(wo, s)),
    cs => cs && cs.length > 0,
  );

  return info;
}
