import { isArray } from '../array';
import DefaultRefRegistry, { RefRegistry } from './ref-registry';

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
export type RefFor<K extends keyof Reg, Reg extends RefRegistry = DefaultRefRegistry> = Reg[K];

export type RefTypes<Reg extends RefRegistry = DefaultRefRegistry> = keyof Reg;
export type AnyRef<Reg extends RefRegistry = DefaultRefRegistry> = Reg[RefTypes<Reg>];

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
export function createRef<
  K extends RefTypes<Reg> & string,
  Reg extends RefRegistry = DefaultRefRegistry
>(type: K, id: string): Ref<K, K> {
  return [type as any, id as any];
}

/**
 * Get a reference's type name
 * @param ref the reference
 */
export function refType<K extends string, Reg extends RefRegistry = DefaultRefRegistry>(
  ref: Ref<K, any>,
): K {
  return ref[0] as any;
}

/**
 * Get a reference's ID
 * @param ref the reference
 */
export function refId<S extends {}>(ref: Ref<any, S>): S {
  return ref[1] as any;
}
