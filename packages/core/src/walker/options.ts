import { ModulePathNormalizer, PASSTHROUGH_MODULE_PATH_NORMALIZER } from '@code-to-json/utils-ts';

export interface WalkerOptions {
  includeDeclarations: 'all' | 'none';
  pathNormalizer: ModulePathNormalizer;
}

export const DEFAULT_WALKER_OPTIONS: WalkerOptions = {
  includeDeclarations: 'none',
  pathNormalizer: PASSTHROUGH_MODULE_PATH_NORMALIZER,
};
