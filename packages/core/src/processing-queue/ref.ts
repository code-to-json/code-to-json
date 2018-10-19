import { EntityMap } from '../types';

export default interface Ref<K extends keyof EntityMap> {
  refType: K;
  id: string;
}

export function isRef(thing: any): thing is Ref<any> {
  return thing && thing.refType && thing.id;
}
