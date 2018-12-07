import { UnreachableError } from '@code-to-json/utils';
import { SourceFile } from 'typescript';

export interface IWalkerOptionArgs {
  includeDeclarations: 'all' | 'none';
}

const DEFAULT_WALKER_OPTIONS: IWalkerOptionArgs = {
  includeDeclarations: 'none'
};

export interface WalkerOptions {
  shouldIncludeSourceFile(sf: SourceFile): boolean;
}

export default function createWalkerOptions(rawOpts: Partial<IWalkerOptionArgs>): WalkerOptions {
  const opts = Object.assign({}, DEFAULT_WALKER_OPTIONS, rawOpts);

  return {
    shouldIncludeSourceFile(sf: SourceFile): boolean {
      const { includeDeclarations } = opts;
      if (includeDeclarations === 'all') {
        return true;
      } else if (includeDeclarations === 'none') {
        return !sf.isDeclarationFile;
      } else {
        throw new UnreachableError(includeDeclarations);
      }
    }
  };
}
