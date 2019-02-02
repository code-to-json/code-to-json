export {
  isDeclaration,
  isNode,
  isSymbol,
  isType,
  isObjectReferenceType,
  isObjectType,
  isTupleType,
  isMappedType,
  isInterfaceType,
  isAnonymousType,
  isIndexType,
  isConditionalType,
  isIndexedAccessType,
  isPrimitiveType,
} from './typeguards';
export { mapDict, filterDict, reduceDict, forEachDict } from './dict';
export {
  createProgramFromCodeString,
  createProgramFromEntries,
  createProgramFromTsConfig,
} from './program';
export { isAbstractDeclaration, isDeclarationExported } from './declaration';
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
export { getTsLibName } from './ts-lib';
export { getFirstIdentifier, MappedType, AnonymousType, TypeMapper } from './ts-internal';
export {
  getTypeStringForRelevantTypes,
  getRelevantTypesForSymbol,
  SymbolRelevantTypes,
} from './symbol';
export { isErroredType } from './type';
export { modifiersToStrings } from './modifiers';
export { nameForNode } from './node';
