import { isArray } from '../guards';

export interface RefId {
  __refid: any;
}
export interface RefType<T> {
  __reftype: T;
}
export type Ref<K extends string> = [RefType<K>, RefId];

// tslint:disable-next-line:no-empty-interface
export interface RefMap {}

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

export function createRef<K extends RefTypes>(type: K, id: string): Ref<K> {
  return [type as RefType<K>, id as any];
}

export function refType<K extends string, R extends Ref<K>>(ref: Ref<K>): K {
  return ref[0] as any;
}

export function refId(ref: Ref<any>): string {
  return ref[1] as any;
}

export type RefFor<K extends keyof RefMap> = RefMap[K];

export type RefTypes = keyof RefMap;
export type AnyRef = RefMap[RefTypes];
