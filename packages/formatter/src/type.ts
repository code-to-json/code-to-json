import { SerializedType, TypeRef, WalkerOutputData } from '@code-to-json/core';
import { isDefined, isRef, refId } from '@code-to-json/utils';
import { DataCollector } from './data-collector';
import formatFlags from './flags';
import resolveReference from './resolve-reference';
import formatSignature from './signature';
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
  ref: FormattedTypeRef,
  collector: DataCollector,
): FormattedType {
  const {
    typeString,
    flags,
    objectFlags,
    defaultType: defaultTypeRef,
    constraint: constraintRef,
    constructorSignatures,
    callSignatures,
    properties,
    libName,
    typeParameters,
    numberIndexType,
    stringIndexType,
    baseTypes,
    isThisType,
  } = type;

  const typeInfo: FormattedType = {
    id: refId(ref),
    text: typeString,
    flags: formatFlags(flags),
    objectFlags: formatFlags(objectFlags),
    isThisType,
  };
  if (constraintRef) {
    typeInfo.constraint = collector.queue(resolveReference(wo, constraintRef), 't');
  }
  if (typeParameters) {
    const typeParameterRefs = typeParameters
      .map(tp => {
        if (!tp) {
          return undefined;
        }

        const typ = resolveReference(wo, tp);

        if (!typ) {
          return undefined;
        }
        return typ;
      })
      .filter(isDefined);
    const thisType: SerializedType | undefined = typeParameterRefs.filter(t => t.isThisType)[0];
    const otherTypeParams: SerializedType[] = typeParameterRefs.filter(t => !t.isThisType);
    if (otherTypeParams.length > 0) {
      typeInfo.typeParameters = otherTypeParams
        .map(tp => collector.queue(tp, 't'))
        .filter(isDefined);
    }
    if (thisType) {
      typeInfo.thisType = collector.queue(thisType, 't');
    }
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
  if (constructorSignatures) {
    typeInfo.constructorSignatures = constructorSignatures.map(cs =>
      formatSignature(wo, cs, collector),
    );
  }
  if (callSignatures) {
    typeInfo.callSignatures = callSignatures.map(cs => formatSignature(wo, cs, collector));
  }
  return typeInfo;
}
