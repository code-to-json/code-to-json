import { SerializedSignature, WalkerOutputData } from '@code-to-json/core';
import resolveReference from './resolve-reference';
import formatType from './type';
import { FormattedSignature } from './types';

export default function formatSignature(
  wo: WalkerOutputData,
  s: Readonly<SerializedSignature>,
): FormattedSignature {
  const { parameters, typeParameters, returnType } = s;
  const signatureInfo: FormattedSignature = {
    parameters:
      parameters &&
      parameters.map(p => {
        const sym = resolveReference(wo, p);
        const { type } = sym;
        const typ = type && resolveReference(wo, type);
        return {
          name: sym.name,
          type: typ && formatType(wo, typ),
        };
      }),
  };
  if (returnType) {
    const typ = resolveReference(wo, returnType);
    signatureInfo.returnType = formatType(wo, typ);
  }
  if (typeParameters) {
    signatureInfo.typeParameters = typeParameters.map(tp => {
      const typ = resolveReference(wo, tp);
      return formatType(wo, typ);
    });
  }
  return signatureInfo;
}
