import { isDefined, isRef, refId } from '@code-to-json/utils';
import {
  flagsToString,
  getTsLibFilename,
  isAnonymousType,
  isClassOrInterfaceType,
  isMappedType,
  isObjectReferenceType,
  isObjectType,
  isTupleType,
  MappedType,
  relevantDeclarationForSymbol,
} from '@code-to-json/utils-ts';
import { isPrimitiveType } from '@code-to-json/utils-ts/lib/src/guards';
import { Dict } from '@mike-north/types';
import * as ts from 'typescript';
import { SymbolRef, TypeRef } from '../types/ref';
import { SerializedType } from '../types/serialized-entities';
import { Collector } from '../types/walker';
import serializeSignature from './signature';

function serializeTypeReference(
  type: ts.TypeReference,
  checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> {
  const { queue: q } = c;
  const { target, typeArguments } = type;
  const out: Partial<SerializedType> = { target: q.queue(target, 'type') };
  if (typeArguments) {
    out.typeArguments = typeArguments.map(ta => q.queue(ta, 'type')).filter(isRef);
  }
  return out;
}

function serializeMappedType(
  type: MappedType,
  checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> {
  const { queue: q } = c;
  const { typeParameter, constraintType, templateType, modifiersType, symbol } = type;
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
  checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> {
  const { objectFlags } = type;
  const out: Partial<SerializedType> = {
    objectFlags: flagsToString(objectFlags, 'object'),
  };
  const { queue: q } = c;
  const stringIndexType = checker.getIndexTypeOfType(type, ts.IndexKind.String);
  if (stringIndexType) {
    out.stringIndexType = q.queue(stringIndexType, 'type');
  }
  const numberIndexType = checker.getIndexTypeOfType(type, ts.IndexKind.Number);
  if (numberIndexType) {
    out.numberIndexType = q.queue(numberIndexType, 'type');
  }
  const callSignatures = type.getCallSignatures();
  if (callSignatures && callSignatures.length > 0) {
    out.callSignatures = callSignatures.map(cs => serializeSignature(cs, checker, c));
  }
  const constructSignatures = type.getConstructSignatures();
  if (constructSignatures && constructSignatures.length > 0) {
    out.constructorSignatures = constructSignatures.map(cs => serializeSignature(cs, checker, c));
  }
  const properties: ts.Symbol[] = type.getProperties();
  if (properties && properties.length > 0) {
    out.properties = properties.reduce(
      (props, prop) => {
        const k = prop.name;
        // eslint-disable-next-line no-param-reassign
        props[k] = q.queue(prop, 'symbol');
        return props;
      },
      {} as Dict<SymbolRef>,
    );
  }
  return out;
}

function serializeRelatedTypes(
  type: ts.ObjectType,
  checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> {
  const out: Partial<SerializedType> = {};
  if (type.objectFlags) {
    out.objectFlags = flagsToString(type.objectFlags, 'object');
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
  if (isTupleType(type) || isAnonymousType(type)) {
    Object.assign(out, serializeObjectType(type, checker, c));
  }
  return out;
}

function isIndexType(type: ts.Type): type is ts.IndexType {
  return !!(type.flags & ts.TypeFlags.Index);
}

function isIndexedAccessType(type: ts.Type): type is ts.IndexedAccessType {
  return !!(type.flags & ts.TypeFlags.IndexedAccess);
}

function serializeTypeParameterType(
  typ: ts.TypeParameter,
  _checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> {
  const out: Partial<SerializedType> = {};
  const constraint = typ.getConstraint();
  if (constraint) {
    out.constraint = c.queue.queue(typ, 'type');
  }
  return out;
}
function serializeUnionOrIntersectionType(
  typ: ts.UnionOrIntersectionType,
  _checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> {
  const out: Partial<SerializedType> = {
    types: typ.types.map(t => c.queue.queue(t, 'type')).filter(isDefined),
  };
  return out;
}
function serializeIndexType(
  typ: ts.IndexType,
  _checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> {
  const out: Partial<SerializedType> = {
    types: [c.queue.queue(typ.type, 'type')].filter(isDefined),
  };
  return out;
}
function serializeIndexAccessType(
  typ: ts.IndexedAccessType,
  checker: ts.TypeChecker,
  c: Collector,
): Partial<SerializedType> {
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

/**
 * Serialize a Type to a POJO
 * @param typ Type to serialize
 * @param checker A type-checker
 * @param ref Reference to the type being serialized
 * @param queue Processing queue
 */
export default function serializeType(
  typ: ts.Type,
  checker: ts.TypeChecker,
  ref: TypeRef,
  c: Collector,
): SerializedType {
  const { symbol } = typ as { symbol?: ts.Symbol };
  const serializedType: SerializedType = {
    typeString: checker.typeToString(typ),
    entity: 'type',
    id: refId(ref),
    flags: flagsToString(typ.flags, 'type'),
    symbol: c.queue.queue(typ.symbol, 'symbol'),
  };

  const decl = relevantDeclarationForSymbol(symbol);
  if (decl) {
    const sourceFile = decl.getSourceFile();
    const libName = getTsLibFilename(sourceFile.fileName);
    if (libName) {
      serializedType.libName = libName;
    } else {
      serializedType.sourceFile = c.queue.queue(sourceFile, 'sourceFile');
    }
  }
  if (isPrimitiveType(typ)) {
    serializedType.primitive = true;
  }

  if (!c.cfg.shouldSerializeSymbolDetails(typ.symbol)) {
    return serializedType;
  }
  if (isObjectType(typ)) {
    Object.assign(serializedType, { ...serializeRelatedTypes(typ, checker, c) });
  }
  if (typ.isTypeParameter()) {
    Object.assign(serializedType, { ...serializeTypeParameterType(typ, checker, c) });
  }
  if (typ.isUnionOrIntersection()) {
    Object.assign(serializedType, { ...serializeUnionOrIntersectionType(typ, checker, c) });
  }
  if (isIndexType(typ)) {
    Object.assign(serializedType, { ...serializeIndexType(typ, checker, c) });
  }
  if (isIndexedAccessType(typ)) {
    Object.assign(serializedType, { ...serializeIndexAccessType(typ, checker, c) });
  }

  return serializedType;
}
