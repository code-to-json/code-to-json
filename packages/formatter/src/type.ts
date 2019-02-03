import { SerializedType, TypeRef, WalkerOutputData } from '@code-to-json/core';
import { SerializedTypeConditionInfo } from '@code-to-json/core/lib/src/types/serialized-entities';
import { isDefined, refId } from '@code-to-json/utils';
import { DataCollector } from './data-collector';
import formatFlags from './flags';
import resolveReference from './resolve-reference';
import formatSignature from './signature';
import { FormattedType, FormattedTypeConditionInfo, FormattedTypeRef } from './types';
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

function formatTypeParametersAndConstraints(
  wo: WalkerOutputData,
  type: Readonly<SerializedType>,
  collector: DataCollector,
): Pick<FormattedType, 'typeParameters' | 'constraint' | 'thisType' | 'defaultType'> {
  const { typeParameters, constraint: constraintRef, defaultType: defaultTypeRef } = type;
  const typeInfo: Pick<
    FormattedType,
    'typeParameters' | 'constraint' | 'thisType' | 'defaultType'
  > = {};
  if (constraintRef) {
    typeInfo.constraint = collector.queue(resolveReference(wo, constraintRef), 't');
  }

  if (defaultTypeRef) {
    typeInfo.defaultType = collector.queue(resolveReference(wo, defaultTypeRef), 't');
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
  if (constraintRef) {
    const constraint = resolveReference(wo, constraintRef);
    typeInfo.constraint = collector.queue(constraint, 't');
  }
  return typeInfo;
}

function formatIndexSignatures(
  wo: WalkerOutputData,
  type: Readonly<SerializedType>,
  collector: DataCollector,
): Pick<FormattedType, 'numberIndexType' | 'stringIndexType'> {
  const { numberIndexType, stringIndexType } = type;
  const typeInfo: Pick<FormattedType, 'numberIndexType' | 'stringIndexType'> = {};
  const numberIndexTypeArr = resolveAndFormatType(wo, collector, numberIndexType);
  const stringIndexTypeArr = resolveAndFormatType(wo, collector, stringIndexType);
  if (numberIndexTypeArr && numberIndexTypeArr.length > 0) {
    typeInfo.numberIndexType = numberIndexTypeArr;
  }
  if (stringIndexTypeArr && stringIndexTypeArr.length > 0) {
    typeInfo.stringIndexType = stringIndexTypeArr;
  }
  return typeInfo;
}

function formatCallAndConstructSignatures(
  wo: WalkerOutputData,
  type: Readonly<SerializedType>,
  collector: DataCollector,
): Pick<FormattedType, 'constructorSignatures' | 'callSignatures'> {
  const typeInfo: Pick<FormattedType, 'constructorSignatures' | 'callSignatures'> = {};
  const { constructorSignatures, callSignatures } = type;
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

function formatConditionInfo(
  wo: WalkerOutputData,
  cond: SerializedTypeConditionInfo | undefined,
  collector: DataCollector,
): Pick<FormattedType, 'conditionalInfo'> | undefined {
  if (!cond) {
    return undefined;
  }
  const conditionalInfo: FormattedTypeConditionInfo = {
    extendsType: collector.queue(resolveReference(wo, cond.extendsType), 't')!,
    checkType: collector.queue(resolveReference(wo, cond.checkType), 't')!,
  };
  if (cond.trueType) {
    conditionalInfo.trueType = collector.queue(resolveReference(wo, cond.trueType), 't');
  }
  if (cond.falseType) {
    conditionalInfo.falseType = collector.queue(resolveReference(wo, cond.falseType), 't');
  }
  return {
    conditionalInfo,
  };
}

// tslint:disable-next-line:cognitive-complexity
export default function formatType(
  wo: WalkerOutputData,
  type: Readonly<SerializedType>,
  ref: FormattedTypeRef,
  collector: DataCollector,
): FormattedType {
  const {
    text,
    objectFlags,
    properties,
    libName,
    baseTypes,
    isThisType,
    symbol,
    types,
    flags,
    conditionalInfo,
  } = type;
  const typeInfo: FormattedType = {
    id: refId(ref),
    text,
    flags: formatFlags(flags),
    isThisType,
  };
  if (objectFlags) {
    typeInfo.objectFlags = formatFlags(objectFlags);
  }
  if (libName) {
    typeInfo.libName = libName;
  }
  if (baseTypes && baseTypes.length > 0) {
    typeInfo.baseTypes = baseTypes
      .map(bt => collector.queue(resolveReference(wo, bt), 't'))
      .filter(isDefined);
  }

  if (properties && Object.keys(properties).length > 0) {
    typeInfo.properties = formatSymbolRefMap(properties, wo, collector);
  }
  if (symbol) {
    typeInfo.symbol = collector.queue(resolveReference(wo, symbol), 's');
  }
  if (types) {
    typeInfo.types = types
      .map(t => collector.queue(resolveReference(wo, t), 't'))
      .filter(isDefined);
  }

  Object.assign(
    typeInfo,
    formatCallAndConstructSignatures(wo, type, collector),
    formatTypeParametersAndConstraints(wo, type, collector),
    formatIndexSignatures(wo, type, collector),
    formatConditionInfo(wo, conditionalInfo, collector),
  );
  return typeInfo;
}
