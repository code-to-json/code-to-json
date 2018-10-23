import { SerializedSymbol, WalkerOutput } from '@code-to-json/core';
import { isObject } from '@code-to-json/utils';
import resolveReference from '../resolve-reference';
import formatFlags from './flags';
import formatSignature, { FormattedSignature } from './signature';
import formatType from './type';

export interface FormattedSymbol {
  name: string;
  documentation: string;
  flags?: string[];
  exports?: FormattedSymbol[];
  members?: FormattedSymbol[];
  jsDocTags?: Array<{ name: string; text?: string }>;
  callSignatures?: FormattedSignature[];
  constructorSignatures?: FormattedSignature[];
}

export default function formatSymbol(
  wo: WalkerOutput,
  symbol: Readonly<SerializedSymbol>
): FormattedSymbol {
  const {
    name,
    flags: _rawFlags,
    exports,
    members,
    jsDocTags,
    callSignatures,
    constructorSignatures,
    documentation
  } = symbol;
  const info: FormattedSymbol = {
    name: name || '(anonymous)',
    flags: formatFlags(_rawFlags),
    documentation,
    jsDocTags
  };
  if (exports && exports.length > 0) {
    info.exports = exports
      .map(e => {
        const exp = resolveReference(wo, e);
        if (!exp) {
          return;
        }
        return formatSymbol(wo, exp);
      })
      .filter(isObject);
  }
  if (members && members.length > 0) {
    info.members = members
      .map(m => {
        const exp = resolveReference(wo, m);
        if (!exp) {
          return;
        }
        return formatSymbol(wo, exp);
      })
      .filter(isObject);
  }
  if (callSignatures && callSignatures.length > 0) {
    info.callSignatures = callSignatures.map(s => formatSignature(wo, s));
  }
  if (constructorSignatures && constructorSignatures.length > 0) {
    info.constructorSignatures = constructorSignatures.map(s => formatSignature(wo, s));
  }
  return info;
}
