import * as ts from 'typescript';
import { AnonymousType, MappedType } from '../ts-internal';

const PRIMITIVE_TYPES =
  ts.TypeFlags.Number |
  ts.TypeFlags.String |
  ts.TypeFlags.Boolean |
  ts.TypeFlags.ESSymbol |
  ts.TypeFlags.Void |
  ts.TypeFlags.Undefined |
  ts.TypeFlags.Null;

/**
 * Check whether a given type is an index type (i.e., `keyof Foo`)
 *
 * @param type type to check
 * @public
 */
export function isIndexType(type: ts.Type): type is ts.IndexType {
  return !!(type.flags & ts.TypeFlags.Index);
}

/**
 * Check whether a given type is an indexed access type (i.e., `Foo['bar']`)
 *
 * @param type type to check
 * @public
 */
export function isIndexedAccessType(type: ts.Type): type is ts.IndexedAccessType {
  return !!(type.flags & ts.TypeFlags.IndexedAccess);
}

/**
 * Check whether a given type is a primitive type
 *
 * @param type type to check
 * @public
 */
export function isPrimitiveType(type: ts.Type): boolean {
  return !!(type.flags & PRIMITIVE_TYPES);
}

/**
 * Check whether a given type is a conditional type
 *
 * @param type type to check
 * @public
 */
export function isConditionalType(type: ts.Type): type is ts.ConditionalType {
  return !!(type.flags & ts.TypeFlags.Conditional);
}

/**
 * Check whether a Type is an ObjectType
 *
 * @param type Type
 * @public
 */
export function isObjectType(type: ts.Type): type is ts.ObjectType {
  return !!(type.flags & ts.TypeFlags.Object);
}

/**
 * Check whether a given type describes an interface (or class)
 *
 *
 * @param type type to check
 * @public
 */
export function isInterfaceType(type: ts.Type): type is ts.InterfaceType {
  return (
    isObjectType(type) && !!(type.objectFlags & (ts.ObjectFlags.Class | ts.ObjectFlags.Interface))
  );
}

/**
 * Check whether a given type is a ts.ReferenceType
 *
 * @param type type to check
 * @public
 */
export function isObjectReferenceType(type: ts.Type): type is ts.TypeReference {
  return isObjectType(type) && !!(type.objectFlags & ts.ObjectFlags.Reference);
}

/**
 * Check whether a given type describes a tuple
 *
 * @param type type to check
 * @public
 */
export function isTupleType(type: ts.Type): type is ts.TupleType {
  return isObjectType(type) && !!(type.objectFlags & ts.ObjectFlags.Tuple);
}

/**
 * Check whether a given type is anonymous
 *
 * @param type type to check
 * @public
 */
export function isAnonymousType(type: ts.Type): type is AnonymousType {
  return isObjectType(type) && !!(type.objectFlags & ts.ObjectFlags.Anonymous);
}

/**
 * Check whether a given type is a mapped type
 *
 * @param type type to check
 * @private
 */
export function isMappedType(type: ts.Type): type is MappedType {
  return isObjectType(type) && !!(type.objectFlags & ts.ObjectFlags.Mapped);
}
/**
 * Check whether a given type has degraded to an `any` due to an error of some sort
 *
 * @param type type to check
 * @public
 */
export function isErroredType(type: ts.Type): boolean {
  return !!(type.flags & ts.TypeFlags.Any) && (type as any).intrinsicName === 'error';
}
