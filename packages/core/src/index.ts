export {
  SerializedSignature,
  SerializedSourceFile,
  SerializedNode,
  SerializedSymbol,
  SerializedType,
  SerializedDeclaration,
  AmdDependency,
  SerializedFileReference,
  HasDocumentation,
  SerializedCodeRange,
  SerializedTypeAttributes,
  SerializedSymbolAttributes,
  SerializedSourceFileAttributes,
  SerializedEntity,
  SerializedSignatureAttributes,
} from './types/serialized-entities';
export {
  DeclarationRef,
  NodeRef,
  RefRegistry,
  SourceFileRef,
  SymbolRef,
  TypeRef,
  SerializedOutputMap,
} from './types/ref';
export { WalkerOutput, WalkerOutputData, WalkerOutputMetadata } from './types/walker';
export { walkProgram } from './walker';
export { WalkerOptions } from './walker/options';
