import { UnreachableError } from '@code-to-json/utils';
import { ModulePathNormalizer, PASSTHROUGH_MODULE_PATH_NORMALIZER } from '@code-to-json/utils-ts';
import * as ts from 'typescript';
import { DEFAULT_WALKER_OPTIONS, WalkerOptions } from './options';

export default class WalkerConfig {
  protected opts: WalkerOptions;

  // tslint:disable-next-line member-ordering
  public pathNormalizer: ModulePathNormalizer;

  constructor(opts: Partial<WalkerOptions>) {
    this.opts = { ...DEFAULT_WALKER_OPTIONS, ...opts };
    this.pathNormalizer = this.opts.pathNormalizer || PASSTHROUGH_MODULE_PATH_NORMALIZER;
  }

  public shouldIncludeSourceFile(sf: ts.SourceFile): boolean {
    const { includeDeclarations } = this.opts;
    if (includeDeclarations === 'all') {
      return true;
    }
    if (includeDeclarations === 'none') {
      return !sf.isDeclarationFile;
    }
    throw new UnreachableError(includeDeclarations);
  }

  // eslint-disable-next-line class-methods-use-this
  public shouldSerializeSymbolDetails(sym: ts.Symbol): boolean {
    return true;
  }
}
