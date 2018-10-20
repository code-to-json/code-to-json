import { EntityMap } from '../types';

interface Ref<K extends keyof EntityMap> {
  refType: K;
  id: string;
}
export interface SymbolRef extends Ref<'symbol'> {}
export interface DeclarationRef extends Ref<'declaration'> {}
export interface NodeRef extends Ref<'node'> {}
export interface TypeRef extends Ref<'type'> {
  typeString: string;
}

export type AnyRef = SymbolRef | DeclarationRef | NodeRef | TypeRef;

export interface RefMap {
  symbol: SymbolRef;
  node: NodeRef;
  declaration: DeclarationRef;
  type: TypeRef;
}

export type RefFor<K extends keyof RefMap> = RefMap[K];

export function isRef<R extends AnyRef>(thing?: R): thing is R {
  return !!thing && !!thing.refType && !!thing.id;
}
