import { UnreachableError } from '@code-to-json/utils';
import { ModulePathNormalizer, PASSTHROUGH_MODULE_PATH_NORMALIZER } from '@code-to-json/utils-ts';
import { Dict } from '@mike-north/types';
import * as ts from 'typescript';
import { DEFAULT_WALKER_OPTIONS, WalkerOptions } from './options';

function isInternalSymbol(sym: ts.Symbol): boolean {
  const x = (ts.InternalSymbolName as unknown) as Dict<string>;
  const values = Object.keys(x).map(k => x[k]);
  return values.includes(sym.name);
}

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
  public shouldSerializeSymbolDetails(
    checker: ts.TypeChecker,
    sym?: ts.Symbol,
    decl?: ts.Declaration,
  ): boolean {
    if (!sym || isInternalSymbol(sym)) {
      return false;
    }
    if (!decl) {
      if (sym.flags & ts.SymbolFlags.Prototype) {
        return false;
      }
      throw new Error(`Found no declaration for symbol ${checker.symbolToString(sym)}`);
    } else {
      return this.shouldSerializeSourceFile(decl.getSourceFile());
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public shouldSerializeSourceFile(sf: ts.SourceFile): boolean {
    return !sf.isDeclarationFile;
  }
}
