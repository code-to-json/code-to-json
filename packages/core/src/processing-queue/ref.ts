import { Ref } from '@code-to-json/utils';

export type SymbolRef = Ref<'symbol'>;
export type DeclarationRef = Ref<'declaration'>;
export type NodeRef = Ref<'node'>;
export type TypeRef = Ref<'type'>;
export type SourceFileRef = Ref<'sourceFile'>;

declare module '@code-to-json/utils/lib/src/deferred-processing/ref-registry' {
  export default interface RefRegistry {
    symbol: SymbolRef;
    node: NodeRef;
    declaration: DeclarationRef;
    type: TypeRef;
    sourceFile: SourceFileRef;
  }
}
