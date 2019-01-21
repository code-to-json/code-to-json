import { SerializedType, TypeRef, WalkerOutputData } from '@code-to-json/core';
import { isDefined, isRef } from '@code-to-json/utils';
import { DataCollector } from './data-collector';
import formatFlags from './flags';
import resolveReference from './resolve-reference';
import { FormattedType, FormattedTypeRef } from './types';
import { formatSymbolRefMap } from './utils';

function resolveAndFormatType(
  wo: WalkerOutputData,
  collector: DataCollector,
  typeRef?: TypeRef,
): FormattedTypeRef | undefined {
  if (!typeRef) {
    return undefined;
  }

  const typ = resolveReference(wo, typeRef);

  if (!typ) {
    return undefined;
  }
  return collector.queue(typ, 't');
}

// tslint:disable-next-line:cognitive-complexity
export default function formatType(
  wo: WalkerOutputData,
  type: Readonly<SerializedType>,
  collector: DataCollector,
): FormattedType {
  const {
    typeString,
    flags,
    objectFlags,
    aliasSymbol: aliasSymbolRef,
    aliasTypeArguments: aliasTypeArgumentRefs,
    defaultType: defaultTypeRef,
    constraint: constraintRef,
    properties,
    libName,
    numberIndexType,
    stringIndexType,
    baseTypes,
  } = type;

  const typeInfo: FormattedType = {
    text: typeString,
    flags: formatFlags(flags),
    objectFlags: formatFlags(objectFlags),
  };
  if (aliasSymbolRef) {
    typeInfo.aliasSymbol = collector.queue(resolveReference(wo, aliasSymbolRef), 's');
  }
  if (aliasTypeArgumentRefs) {
    typeInfo.aliasTypeArguments = aliasTypeArgumentRefs
      .map(r => collector.queue(resolveReference(wo, r), 't'))
      .filter(isDefined);
  }
  if (constraintRef) {
    typeInfo.constraint = collector.queue(resolveReference(wo, constraintRef), 't');
  }
  if (defaultTypeRef) {
    typeInfo.defaultType = collector.queue(resolveReference(wo, defaultTypeRef), 't');
  }
  if (libName) {
    typeInfo.libName = libName;
  }
  if (baseTypes && baseTypes.length > 0) {
    typeInfo.baseTypes = baseTypes
      .map(bt => collector.queue(resolveReference(wo, bt), 't'))
      .filter(isRef);
  }
  const numberIndexTypeArr = resolveAndFormatType(wo, collector, numberIndexType);
  const stringIndexTypeArr = resolveAndFormatType(wo, collector, stringIndexType);
  if (numberIndexTypeArr && numberIndexTypeArr.length > 0) {
    typeInfo.numberIndexType = numberIndexTypeArr;
  }
  if (stringIndexTypeArr && stringIndexTypeArr.length > 0) {
    typeInfo.stringIndexType = stringIndexTypeArr;
  }
  if (properties && Object.keys(properties).length > 0) {
    typeInfo.properties = formatSymbolRefMap(properties, wo, collector);
  }
  if (constraintRef) {
    const constraint = resolveReference(wo, constraintRef);
    typeInfo.constraint = collector.queue(constraint, 't');
  }

  return typeInfo;
}
