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
  isErroredType,
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
  createReverseResolver,
  ModuleInfo,
  ProjectInfo,
  ReverseResolver,
  PASSTHROUGH as PASSTHROUGH_REVERSE_RESOLVER,
} from './reverse-resolver';
export { createIdGenerator, generateHash, IDableEntity } from './generate-id';
export { flagsToString, getObjectFlags, Flags } from './flags';
export { getTsLibName } from './ts-lib';
export { getFirstIdentifier, MappedType, AnonymousType, TypeMapper } from './ts-internal';
export {
  getTypeStringForRelevantTypes,
  getRelevantTypesForSymbol,
  SymbolRelevantTypes,
} from './symbol';
export { modifiersToStrings } from './modifiers';
export { getNameForNode } from './node';
