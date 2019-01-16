export {
  SerializedDeclaration,
  SerializedSignature,
  SerializedSourceFile,
  SerializedNode,
  SerializedSymbol,
  SerializedType,
  SerializedAmdDependency,
  SerializedBuiltInType,
  SerializedCoreType,
  SerializedCustomType,
  SerializedFileReference,
} from './types/serialized-entities';
export {
  DeclarationRef,
  NodeRef,
  RefRegistry,
  SourceFileRef,
  SymbolRef,
  TypeRef,
} from './types/ref';
export { WalkerOutput, WalkerOutputData, WalkerOutputMetadata, walkProgram } from './walker';
export { WalkerOptions } from './walker/options';
