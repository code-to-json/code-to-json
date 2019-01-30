import { isDefined, isRef, refId } from '@code-to-json/utils';
import {
  flagsToString,
  getTsLibFilename,
  isAnonymousType,
  isClassOrInterfaceType,
  isConditionalType,
  isIndexedAccessType,
  isIndexType,
  isMappedType,
  isObjectReferenceType,
  isObjectType,
  isPrimitiveType,
  isTupleType,
  MappedType,
  relevantDeclarationForSymbol,
} from '@code-to-json/utils-ts';
import { Dict } from '@mike-north/types';
import * as ts from 'typescript';
import { SymbolRef, TypeRef } from '../types/ref';
import { SerializedType, SerializedTypeConditionInfo } from '../types/serialized-entities';
import { Collector } from '../types/walker';
import serializeSignature from './signature';

function serializeTypeReference(
  type: ts.TypeReference,
  _checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> {
  const { queue: q } = c;
  const { target, typeArguments } = type;
  const out: Partial<SerializedType> = {
    target: q.queue(target, 'type'),
  };
  if (typeArguments) {
    out.typeParameters = typeArguments.map(ta => q.queue(ta, 'type')).filter(isRef);
  }
  return out;
}

function serializeMappedType(
  type: MappedType,
  _checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> {
  const { queue: q } = c;
  const { typeParameter, constraintType, templateType, modifiersType } = type;
  const out: Partial<SerializedType> = {
    typeParameters: [q.queue(typeParameter, 'type')].filter(isRef),
    constraint: q.queue(constraintType, 'type'),
    templateType: q.queue(templateType, 'type'),
    modifiersType: q.queue(modifiersType, 'type'),
  };
  return out;
}

function serializeInterfaceType(
  type: ts.InterfaceType,
  checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> {
  const { typeParameters, thisType } = type;
  const baseTypes = type.getBaseTypes();
  const out: Partial<SerializedType> = {
    ...serializeObjectType(type, checker, c),
  };
  if (typeParameters && typeParameters.length > 0) {
    out.typeParameters = typeParameters.map(tp => c.queue.queue(tp, 'type')).filter(isRef);
  }
  if (baseTypes && baseTypes.length > 0) {
    out.baseTypes = baseTypes.map(bt => c.queue.queue(bt, 'type')).filter(isRef);
  }
  if (thisType) {
    out.thisType = c.queue.queue(thisType, 'type');
  }

  return out;
}

function serializeObjectType(
  type: ts.ObjectType,
  _checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> {
  const { objectFlags, aliasTypeArguments } = type;
  const out: Partial<SerializedType> = {};
  if (objectFlags) {
    out.objectFlags = flagsToString(objectFlags, 'object');
  }

  const { queue: q } = c;

  if (aliasTypeArguments && aliasTypeArguments.length > 0) {
    out.typeParameters = aliasTypeArguments.map(tp => c.queue.queue(tp, 'type')).filter(isRef);
  }
  if (c.cfg.shouldSerializeTypeDetails(_checker, type)) {
    const properties: ts.Symbol[] = type.getProperties();
    if (properties && properties.length > 0) {
      out.properties = properties
        .filter(prop => {
          if (prop.flags & ts.SymbolFlags.Prototype) {
            return false;
          }
          return true;
        })
        .reduce(
          (props, prop) => {
            // eslint-disable-next-line no-param-reassign
            props[prop.name] = q.queue(prop, 'symbol');
            return props;
          },
          {} as Dict<SymbolRef>,
        );
    }
  }
  return out;
}

function serializeExtendedRelatedTypes(
  type: ts.Type,
  checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> | undefined {
  const out: Partial<SerializedType> = {};
  if (!isObjectType(type)) {
    return undefined;
  }
  if (isObjectReferenceType(type)) {
    Object.assign(out, serializeTypeReference(type, checker, c));
  }
  if (isMappedType(type)) {
    Object.assign(out, serializeMappedType(type, checker, c));
  }
  if (isClassOrInterfaceType(type)) {
    Object.assign(out, serializeInterfaceType(type, checker, c));
  }

  const callSignatures = type.getCallSignatures();
  if (callSignatures && callSignatures.length > 0) {
    out.callSignatures = callSignatures.map(cs => serializeSignature(cs, checker, c));
  }
  const constructSignatures = type.getConstructSignatures();
  if (constructSignatures && constructSignatures.length > 0) {
    out.constructorSignatures = constructSignatures.map(cs => serializeSignature(cs, checker, c));
  }
  return out;
}

function serializeBasicRelatedTypes(
  type: ts.Type,
  checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> | undefined {
  const out: Partial<SerializedType> = {};
  const { queue: q } = c;
  if (!isObjectType(type)) {
    return undefined;
  }
  if (type.objectFlags) {
    out.objectFlags = flagsToString(type.objectFlags, 'object');
  }

  if (isTupleType(type) || isAnonymousType(type)) {
    Object.assign(out, serializeObjectType(type, checker, c));
  }
  const stringIndexType = checker.getIndexTypeOfType(type, ts.IndexKind.String);
  if (stringIndexType) {
    out.stringIndexType = q.queue(stringIndexType, 'type');
  }
  const numberIndexType = checker.getIndexTypeOfType(type, ts.IndexKind.Number);
  if (numberIndexType) {
    out.numberIndexType = q.queue(numberIndexType, 'type');
  }

  return out;
}

function serializeTypeParameterType(
  typ: ts.TypeParameter,
  _checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> | undefined {
  if (!typ.isTypeParameter()) {
    return undefined;
  }

  const out: Partial<SerializedType> = {};
  const constraint = typ.getConstraint();
  if (constraint) {
    out.constraint = c.queue.queue(constraint, 'type');
  }
  return out;
}
function serializeBasicUnionOrIntersectionTypeInfo(
  typ: ts.Type,
  _checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> | undefined {
  if (!typ.isUnionOrIntersection()) {
    return undefined;
  }

  const out: Partial<SerializedType> = {
    types: typ.types.map(t => c.queue.queue(t, 'type')).filter(isDefined),
  };
  return out;
}
function serializeBasicIndexTypeInfo(
  typ: ts.Type,
  _checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> | undefined {
  if (!isIndexType(typ)) {
    return undefined;
  }
  const out: Partial<SerializedType> = {
    types: [c.queue.queue(typ.type, 'type')].filter(isDefined),
  };
  return out;
}
function serializeBasicIndexAccessTypeInfo(
  typ: ts.Type,
  _checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> | undefined {
  if (!isIndexedAccessType(typ)) {
    return undefined;
  }
  const { objectType, indexType, constraint, simplified } = typ;
  const out: Partial<SerializedType> = {};
  if (constraint) {
    out.constraint = c.queue.queue(constraint, 'type');
  }
  if (simplified) {
    out.simplified = c.queue.queue(simplified, 'type');
  }
  if (indexType) {
    out.indexType = c.queue.queue(indexType, 'type');
  }
  if (objectType) {
    out.objectType = c.queue.queue(objectType, 'type');
  }
  return out;
}

function serializeBasicConditionalTypeInfo(
  type: ts.Type,
  _checker: ts.TypeChecker,
  c: Collector,
): Pick<SerializedType, 'conditionalInfo'> | undefined {
  if (!isConditionalType(type)) {
    return undefined;
  }
  const {
    extendsType,
    checkType,
    root: { trueType, falseType },
  } = type;
  const conditionalInfo: SerializedTypeConditionInfo = {
    extendsType: c.queue.queue(extendsType, 'type')!,
    checkType: c.queue.queue(checkType, 'type')!,
    trueType: c.queue.queue(trueType, 'type'),
    falseType: c.queue.queue(falseType, 'type'),
  };
  return { conditionalInfo };
}

/**
 * Serialize a Type to a POJO
 * @param type Type to serialize
 * @param checker A type-checker
 * @param ref Reference to the type being serialized
 * @param queue Processing queue
 */
export default function serializeType(
  type: ts.Type,
  checker: ts.TypeChecker,
  ref: TypeRef,
  relatedEntities: ts.Type[] | undefined,
  c: Collector,
): SerializedType {
  const { symbol, isThisType } = type as { symbol?: ts.Symbol; isThisType?: boolean };
  const serialized: SerializedType = {
    text: checker.typeToString(type),
    entity: 'type',
    id: refId(ref),
    flags: flagsToString(type.flags, 'type') || [],
    symbol: c.queue.queue(symbol, 'symbol'),
  };
  if (relatedEntities) {
    serialized.relatedTypes = relatedEntities.map(t => c.queue.queue(t, 'type')).filter(isDefined);
  }
  if (isPrimitiveType(type)) {
    serialized.isPrimitive = true;
  }
  if (isThisType) {
    serialized.isThisType = true;
  }
  Object.assign(
    serialized,
    serializeBasicUnionOrIntersectionTypeInfo(type, checker, c),
    serializeBasicConditionalTypeInfo(type, checker, c),
    serializeBasicIndexTypeInfo(type, checker, c),
    serializeBasicIndexAccessTypeInfo(type, checker, c),
    serializeBasicRelatedTypes(type, checker, c),
  );

  if (symbol) {
    const decl = relevantDeclarationForSymbol(symbol);
    if (decl) {
      const sourceFile = decl.getSourceFile();
      const libName = getTsLibFilename(sourceFile.fileName);
      if (libName) {
        serialized.libName = libName;
        // return serialized;
      }
    }
  }

  Object.assign(
    serialized,
    serializeTypeParameterType(type, checker, c),
    serializeExtendedRelatedTypes(type, checker, c),
  );

  return serialized;
}
