import { isArray } from '../array';
import RefRegistry from './ref-registry';

export interface RefId<S> {
  __do_not_use_this_refid: S;
}
export interface RefType<T> {
  __do_not_use_this_reftype: T;
}

/**
 * A reference to an entity in a registry
 */
export type Ref<K extends string, S extends {} = string> = [RefType<K>, RefId<S>];

/**
 * Get a reference type for a registry
 */
export type RefFor<K extends keyof RefRegistry> = RefRegistry[K];

export type RefTypes = keyof RefRegistry;
export type AnyRef = RefRegistry[RefTypes];

/**
 * Check to see whether a value is a reference
 * @param thing value to check
 */
export function isRef<R extends Ref<any>>(thing?: R): thing is R {
  return (
    !!thing &&
    !!isArray(thing) &&
    thing.length === 2 &&
    typeof thing[0] === 'string' &&
    typeof thing[1] === 'string'
  );
}

/**
 * Create a new reference
 * @param type name of the reference type
 * @param id registry-unique of the reference
 * @returns the new reference
 */
export function createRef<K extends RefTypes>(type: K, id: string): Ref<K> {
  return [(type as any) as RefType<K>, id as any];
}

/**
 * Get a reference's type name
 * @param ref the reference
 */
export function refType<K extends string>(ref: Ref<K, any>): K {
  return ref[0] as any;
}

/**
 * Get a reference's ID
 * @param ref the reference
 */
export function refId<S extends {}>(ref: Ref<any, S>): S {
  return ref[1] as any;
}
