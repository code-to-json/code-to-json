export { mapChildren, nameForNode } from './node';
export { isDeclaration, isNamedDeclaration, isNode, isSymbol, isType } from './guards';
export { isDeclarationExported } from './checks';
export { mapUem } from './underscore-escaped-map';
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
export { generateId, generateHash } from './generate-id';
export { flagsToString, getObjectFlags, Flags } from './flags';
export { getTsLibFilename } from './ts-libs';
export { relevantTypeForSymbol, relevantDeclarationForSymbol } from './symbol';
export { getFirstIdentifier } from './ts-internal';
