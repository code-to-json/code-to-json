import { SerializedType, TypeRef, WalkerOutputData } from '@code-to-json/core';
import { SerializedTypeConditionInfo } from '@code-to-json/core/lib/src/types/serialized-entities';
import { isDefined, isRef, refId } from '@code-to-json/utils';
import { DataCollector } from './data-collector';
import resolveReference from './resolve-reference';
import formatSignature from './signature';
import {
  FormattedEnumLiteralType,
  FormattedObjectTypeKind,
  FormattedType,
  FormattedTypeConditionInfo,
  FormattedTypeKind,
  FormattedTypeRef,
} from './types';
import { formatSymbolRefMap } from './utils';

const IRRELEVANT_TYPE_KIND_FLAGS: string[] = ['TODO'];
const IRRELEVANT_OBJECT_TYPE_KIND_FLAGS: string[] = ['Reference', 'Instantiated'];

// BigInt = 64,
// BigIntLiteral = 2048,
// UniqueESSymbol = 8192,
// Index = 4194304,
// IndexedAccess = 8388608,
// Conditional = 16777216,
// Substitution = 33554432,
// NonPrimitive = 67108864,
// Literal = 2944,
// Unit = 109440,
// StringOrNumberLiteral = 384,
// PossiblyFalsy = 117724,
// StringLike = 132,
// NumberLike = 296,
// BigIntLike = 2112,
// BooleanLike = 528,
// EnumLike = 1056,
// ESSymbolLike = 12288,
// VoidLike = 49152,
// UnionOrIntersection = 3145728,
// StructuredType = 3670016,
// TypeVariable = 8650752,
// InstantiableNonPrimitive = 58982400,
// InstantiablePrimitive = 4194304,
// Instantiable = 63176704,
// StructuredOrInstantiable = 66846720,
// Narrowable = 133970943,
// NotUnionOrUnit = 67637251

// tslint:disable-next-line:mccabe-complexity

const TYPE_KIND_MAP: { [k: string]: FormattedTypeKind } = {
  /* JS core types */
  String: FormattedTypeKind.string,
  Number: FormattedTypeKind.number,
  Boolean: FormattedTypeKind.boolean,
  Null: FormattedTypeKind.null,
  Undefined: FormattedTypeKind.undefined,
  ESSymbol: FormattedTypeKind.essymbol,
  Object: FormattedTypeKind.object,

  /* TS core types */
  Any: FormattedTypeKind.any,
  Never: FormattedTypeKind.never,
  Void: FormattedTypeKind.void,
  Unknown: FormattedTypeKind.unknown,

  /* TS enum types */
  EnumLiteral: FormattedTypeKind.enumLiteral,

  /* Primitive Literals */
  StringLiteral: FormattedTypeKind.stringLiteral,
  NumberLiteral: FormattedTypeKind.numberLiteral,
  BooleanLiteral: FormattedTypeKind.booleanLiteral,

  /* Logical Operators */
  Union: FormattedTypeKind.union,
  Intersection: FormattedTypeKind.intersection,

  /* Other stuff */
  TypeParameter: FormattedTypeKind.typeParameter,
  Conditional: FormattedTypeKind.conditional,
  Substitution: FormattedTypeKind.substitution,
};
const OBJECT_TYPE_KIND_MAP: { [k: string]: FormattedObjectTypeKind } = {
  Anonymous: FormattedObjectTypeKind.anonymous,
  Interface: FormattedObjectTypeKind.interface,
  Class: FormattedObjectTypeKind.class,
};

function determineTypeKind(
  type: SerializedType,
): { kind: FormattedTypeKind; other?: Partial<FormattedEnumLiteralType> } {
  const { flags } = type;
  const filteredFlags = flags.filter(f => IRRELEVANT_TYPE_KIND_FLAGS.indexOf(f) < 0);
  const kinds = filteredFlags.map(f => {
    if (TYPE_KIND_MAP[f]) {
      return TYPE_KIND_MAP[f];
    }
    throw new Error(`Could not determine type kind\n${JSON.stringify(type, null, '  ')}`);
  });

  switch (kinds.length) {
    case 1:
      return { kind: kinds[0] };
    case 0:
      throw new Error(`Empty type flags ${JSON.stringify(type, null, '  ')}`);
    case 2:
      if (kinds.includes(FormattedTypeKind.enumLiteral)) {
        const [enumKind] = kinds.filter(k => k !== FormattedTypeKind.enumLiteral);
        if (
          enumKind !== FormattedTypeKind.numberLiteral &&
          enumKind !== FormattedTypeKind.stringLiteral
        ) {
          throw new Error(`Unexpected enum kind: ${FormattedTypeKind[enumKind]}`);
        }
        return { kind: FormattedTypeKind.enumLiteral, other: { enumKind } };
      }
    // eslint-disable-next-line no-fallthrough
    default:
      throw new Error(
        `Multiple kinds identified: ${kinds.join(', ')}\n ${JSON.stringify(type, null, '  ')}`,
      );
  }
}
function determineObjectTypeKind(type: SerializedType): FormattedObjectTypeKind | undefined {
  const { objectFlags: flags = [] } = type;
  const filteredFlags = flags.filter(f => IRRELEVANT_OBJECT_TYPE_KIND_FLAGS.indexOf(f) < 0);
  if (filteredFlags.length === 0) {
    return undefined;
  }
  const kinds = filteredFlags.map(f => {
    if (OBJECT_TYPE_KIND_MAP[f]) {
      return OBJECT_TYPE_KIND_MAP[f];
    }
    throw new Error(`Could not determine type kind\n${JSON.stringify(type, null, '  ')}`);
  });

  switch (kinds.length) {
    case 1:
      return kinds[0];
    case 0:
      throw new Error(`Empty object type flags ${JSON.stringify(type, null, '  ')}`);
    default:
      throw new Error(
        `Multiple object type kinds identified: ${kinds.join(', ')}\n ${JSON.stringify(
          type,
          null,
          '  ',
        )}`,
      );
  }
}

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
    conditionalInfo,
  } = type;
  const { kind, other: otherKindData } = determineTypeKind(type);
  const typeInfo: FormattedType = {
    id: refId(ref),
    text,
    kind,
    isThisType,
  };
  Object.assign(typeInfo, otherKindData);
  if (objectFlags) {
    if (objectFlags.indexOf('Reference')) {
      typeInfo.isReferenceType = true;
    }
    typeInfo.objectKind = determineObjectTypeKind(type);
  }
  if (libName) {
    typeInfo.libName = libName;
  }
  if (baseTypes && baseTypes.length > 0) {
    typeInfo.baseTypes = baseTypes
      .map(bt => collector.queue(resolveReference(wo, bt), 't'))
      .filter(isRef);
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
