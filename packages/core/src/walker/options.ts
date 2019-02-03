import { PASSTHROUGH_REVERSE_RESOLVER, ReverseResolver } from '@code-to-json/utils-ts';

export interface WalkerOptions {
  includeDeclarations: 'all' | 'none';
  pathNormalizer: ReverseResolver;
}

export const DEFAULT_WALKER_OPTIONS: WalkerOptions = {
  includeDeclarations: 'none',
  pathNormalizer: PASSTHROUGH_REVERSE_RESOLVER,
};
