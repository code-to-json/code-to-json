import { UnreachableError } from '@code-to-json/utils';
import { SourceFile } from 'typescript';

export interface WalkerOptions {
  includeDeclarations: 'all' | 'none';
}

const DEFAULT_WALKER_OPTIONS: WalkerOptions = {
  includeDeclarations: 'none',
};

export interface WalkerConfig {
  shouldIncludeSourceFile(sf: SourceFile): boolean;
}

export default function createWalkerConfig(rawOpts: Partial<WalkerOptions>): WalkerConfig {
  const opts = Object.assign({}, DEFAULT_WALKER_OPTIONS, rawOpts);

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
