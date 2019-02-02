import * as ts from 'typescript';
import { AnonymousType, MappedType } from '../ts-internal';

export function isIndexType(type: ts.Type): type is ts.IndexType {
  return !!(type.flags & ts.TypeFlags.Index);
}

export function isIndexedAccessType(type: ts.Type): type is ts.IndexedAccessType {
  return !!(type.flags & ts.TypeFlags.IndexedAccess);
}

const PRIMITIVE_TYPES =
  ts.TypeFlags.Number |
  ts.TypeFlags.String |
  ts.TypeFlags.Boolean |
  ts.TypeFlags.ESSymbol |
  ts.TypeFlags.Void |
  ts.TypeFlags.Undefined |
  ts.TypeFlags.Null;

export function isPrimitiveType(type: ts.Type): boolean {
  return !!(type.flags & PRIMITIVE_TYPES);
}

export function isConditionalType(type: ts.Type): type is ts.ConditionalType {
  return !!(type.flags & ts.TypeFlags.Conditional);
}

/**
 * Check whether a Type is an ObjectType
 * @param type Type
 */
export function isObjectType(type: ts.Type): type is ts.ObjectType {
  return !!(type.flags & ts.TypeFlags.Object);
}

export function isInterfaceType(type: ts.Type): type is ts.InterfaceType {
  return (
    isObjectType(type) && !!(type.objectFlags & (ts.ObjectFlags.Class | ts.ObjectFlags.Interface))
  );
}

export function isObjectReferenceType(type: ts.Type): type is ts.TypeReference {
  return isObjectType(type) && !!(type.objectFlags & ts.ObjectFlags.Reference);
}

export function isTupleType(type: ts.Type): type is ts.TupleType {
  return isObjectType(type) && !!(type.objectFlags & ts.ObjectFlags.Tuple);
}

export function isAnonymousType(type: ts.Type): type is AnonymousType {
  return isObjectType(type) && !!(type.objectFlags & ts.ObjectFlags.Anonymous);
}

export function isMappedType(type: ts.Type): type is MappedType {
  return isObjectType(type) && !!(type.objectFlags & ts.ObjectFlags.Mapped);
}
