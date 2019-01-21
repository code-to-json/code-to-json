export {
  SerializedDeclaration,
  SerializedSignature,
  SerializedSourceFile,
  SerializedNode,
  SerializedSymbol,
  SerializedType,
  SerializedAmdDependency,
  SerializedFileReference,
  HasDocumentation,
  HasPosition,
} from './types/serialized-entities';
export {
  DeclarationRef,
  NodeRef,
  RefRegistry,
  SourceFileRef,
  SymbolRef,
  TypeRef,
} from './types/ref';
export { WalkerOutput, WalkerOutputData, WalkerOutputMetadata } from './types/walker';
export { walkProgram } from './walker';
export { WalkerOptions } from './walker/options';
