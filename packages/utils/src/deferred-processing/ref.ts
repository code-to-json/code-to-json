import { isArray } from '../array';

/**
 * The id value, within a reference
 * @private
 */
export interface RefId<S> {
  __do_not_use_this_refid: S;
}

/**
 * The type value, within a reference
 * @private
 */
export interface RefType<T> {
  __do_not_use_this_reftype: T;
}

/**
 * A reference to an entity in a registry
 * @public
 */
export type Ref<K, S extends {} = string> = [RefType<K>, RefId<S>];

/**
 * Get a reference type for a registry
 * @public
 */
export type RefFor<RefRegistry, K extends keyof RefRegistry> = RefRegistry[K];

/**
 * Get the names of types present in a RefRegistry
 * @public
 */
export type RefTypes<RefRegistry> = keyof RefRegistry;

/**
 * Any reference possible for a given RefRegistry
 * @public
 */
export type AnyRef<RefRegistry> = RefRegistry[RefTypes<RefRegistry>];

/**
 * Check to see whether a value is a reference
 * @param thing value to check
 * @public
 */
export function isRef<R extends Ref<any>>(thing?: R): thing is R;
export function isRef<K extends string>(thing: any, refTyp: K): thing is Ref<K>;
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
 * @public
 */
export function createRef<RefRegistry, K extends RefTypes<RefRegistry>>(
  type: K,
  id: string,
): Ref<K> {
  return [(type as any) as RefType<K>, id as any];
}

/**
 * Get a reference's type name
 * @param ref the reference
 * @public
 */
export function refType<K>(ref: Ref<K, any>): K {
  return ref[0] as any;
}

/**
 * Get a reference's ID
 * @param ref the reference
 * @public
 */
export function refId<S extends {}>(ref: Ref<any, S>): S {
  return ref[1] as any;
}

/**
 * A function that turns a reference into a resolved entity
 * @public
 */
export type RefResolver<EntityMap> = <K extends keyof EntityMap>(
  ref?: Ref<K>,
) => EntityMap[K] | undefined;
