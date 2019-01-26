export { mapChildren, nameForNode } from './node';
export {
  isDeclaration,
  isNamedDeclaration,
  isNode,
  isSymbol,
  isType,
  isObjectReferenceType,
  isObjectType,
  isTupleType,
  isMappedType,
  isClassOrInterfaceType,
  isAnonymousType,
  isIndexType,
  isIndexedAccessType,
  isPrimitiveType,
} from './guards';
export { isDeclarationExported } from './checks';
export { mapDict, filterDict, reduceDict, forEachDict } from './dict';
export {
  createProgramFromCodeString,
  createProgramFromEntries,
  createProgramFromTsConfig,
} from './program';
export { default as SysHost } from './host';
export {
  generateModulePathNormalizer,
  ModuleInfo,
  ProjectInfo,
  ModulePathNormalizer,
  PASSTHROUGH_MODULE_PATH_NORMALIZER,
} from './module-path-normalizer';
export { createIdGenerator, generateHash, IDableEntity } from './generate-id';
export { flagsToString, getObjectFlags, Flags } from './flags';
export { getTsLibFilename } from './ts-libs';
export { relevantTypeForSymbol, relevantDeclarationForSymbol } from './symbol';
export { getFirstIdentifier, MappedType, AnonymousType, TypeMapper } from './ts-internal';
export { isErroredType } from './type';
export { modifiersToStrings } from './modifiers';
export { decoratorsToStrings } from './decorators';
