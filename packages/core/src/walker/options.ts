import { UnreachableError } from '@code-to-json/utils';
import { ModulePathNormalizer, PASSTHROUGH_MODULE_PATH_NORMALIZER } from '@code-to-json/utils-ts';
import { SourceFile } from 'typescript';

export interface WalkerOptions {
  includeDeclarations: 'all' | 'none';
  pathNormalizer: ModulePathNormalizer;
}

const DEFAULT_WALKER_OPTIONS: WalkerOptions = {
  includeDeclarations: 'none',
  pathNormalizer: PASSTHROUGH_MODULE_PATH_NORMALIZER,
};

export interface WalkerConfig {
  shouldIncludeSourceFile(sf: SourceFile): boolean;
}

export function populateWalkerOptions(rawOpts: Partial<WalkerOptions>): WalkerOptions {
  return Object.assign({}, DEFAULT_WALKER_OPTIONS, rawOpts);
}

export function createWalkerConfig(opts: WalkerOptions): WalkerConfig {
  return {
    shouldIncludeSourceFile(sf: SourceFile): boolean {
      const { includeDeclarations } = opts;
      if (includeDeclarations === 'all') {
        return true;
      }
      if (includeDeclarations === 'none') {
        return !sf.isDeclarationFile;
      }
      throw new UnreachableError(includeDeclarations);
    },
  };
}
