import { SerializedType, TypeRef, WalkerOutput } from '@code-to-json/core';
import resolveReference from '../resolve-reference';
import formatFlags from './flags';
import formatSymbol, { FormattedSymbol } from './symbol';

export interface FormattedType {
  text: string;
  flags?: string[];
  objectFlags?: string[];
  properties?: FormattedSymbol[];
  numberIndexType?: FormattedType;
  stringIndexType?: FormattedType;
}

function resolveAndFormatType(wo: WalkerOutput, typeRef?: TypeRef): FormattedType | undefined {
  if (!typeRef) {
    return;
  }

  const typ = resolveReference(wo, typeRef);
  if (!typ) {
    return;
  }
  return formatType(wo, typ);
}

export default function formatType(
  wo: WalkerOutput,
  type: Readonly<SerializedType>
): FormattedType {
  const { typeString, flags, objectFlags, properties, numberIndexType, stringIndexType } = type;
  const typeInfo: FormattedType = {
    text: typeString,
    flags: formatFlags(flags),
    objectFlags: formatFlags(objectFlags)
    // numberIndexType: resolveAndFormatType(wo, numberIndexType),
    // stringIndexType: resolveAndFormatType(wo, stringIndexType)
  };

  if (properties && properties.length > 0) {
    typeInfo.properties = properties.map(s => {
      const sym = resolveReference(wo, s);
      return formatSymbol(wo, sym);
    });
  }

  return typeInfo;
}
