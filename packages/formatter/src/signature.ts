import { SerializedSignature, WalkerOutputData } from '@code-to-json/core';
import { isDefined } from '@code-to-json/utils';
import { DataCollector } from './data-collector';
import resolveReference from './resolve-reference';
import { FormattedSignature } from './types';

export default function formatSignature(
  wo: WalkerOutputData,
  s: Readonly<SerializedSignature>,
  collector: DataCollector,
): FormattedSignature {
  const { parameters, typeParameters, returnType, hasRestParameter } = s;
  const signatureInfo: FormattedSignature = {
    hasRestParameter,
    parameters:
      parameters &&
      parameters.map(p => {
        const sym = resolveReference(wo, p);
        const { type } = sym;
        const typ = type && resolveReference(wo, type);
        return {
          name: sym.name,
          type: typ && collector.queue(typ, 't'),
        };
      }),
  };
  if (returnType) {
    const typ = resolveReference(wo, returnType);
    signatureInfo.returnType = collector.queue(typ, 't');
  }
  if (typeParameters) {
    signatureInfo.typeParameters = typeParameters
      .map(tp => {
        const typ = resolveReference(wo, tp);
        return collector.queue(typ, 't');
      })
      .filter(isDefined);
  }
  return signatureInfo;
}
