import { SerializedType, WalkerOutputData } from '@code-to-json/core';
import formatFlags from './flags';
import resolveReference from './resolve-reference';
import formatSymbol from './symbol';
import { FormattedType } from './types';

// tslint:disable-next-line:no-commented-code
// function resolveAndFormatType(wo: WalkerOutput, typeRef?: TypeRef): FormattedType | undefined {
//   if (!typeRef) {
//     return;
//   }

// tslint:disable-next-line:no-commented-code
//   const typ = resolveReference(wo, typeRef);
//   if (!typ) {
//     return;
//   }
//   return formatType(wo, typ);
// }

export default function formatType(
  wo: WalkerOutputData,
  type: Readonly<SerializedType>,
): FormattedType {
  const { typeString, flags, objectFlags, properties } = type;
  const typeInfo: FormattedType = {
    text: typeString,
    flags: formatFlags(flags),
    objectFlags: formatFlags(objectFlags),
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
