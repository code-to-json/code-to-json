import { memoize, UnreachableError } from '@code-to-json/utils';
import { filterDict, PASSTHROUGH_REVERSE_RESOLVER, ReverseResolver } from '@code-to-json/utils-ts';
import { Dict } from '@mike-north/types';
import * as ts from 'typescript';
import { DEFAULT_WALKER_OPTIONS, WalkerOptions } from './options';

const banned = filterDict((ts.InternalSymbolName as unknown) as Dict<string>, (s) =>
  s.startsWith('__'),
);
const values = Object.keys(banned).map((k) => banned[k]);

/**
 *
 * @internal
 */
export function isInternalSymbol(sym: ts.Symbol): boolean {
  return values.includes(sym.name);
}

export default class WalkerConfig {
  public pathNormalizer: ReverseResolver;
  protected opts: WalkerOptions;

  constructor(opts: Partial<WalkerOptions>) {
    this.opts = { ...DEFAULT_WALKER_OPTIONS, ...opts };
    this.pathNormalizer = this.opts.pathNormalizer || PASSTHROUGH_REVERSE_RESOLVER;
  }

  @memoize
  public shouldIncludeSourceFile(sf: ts.SourceFile): boolean {
    const { includeDeclarations } = this.opts;
    if (includeDeclarations === 'all') {
      return true;
    }
    if (includeDeclarations === 'none') {
      return sf.fileName.replace(/[/\\]+/g, '').indexOf('node_modules') < 0;
    }
    throw new UnreachableError(includeDeclarations);
  }

  @memoize
  public shouldSerializeSymbolDetails(sym?: ts.Symbol): boolean {
    if (!sym) {
      return false;
    }
    if (sym.flags & ts.SymbolFlags.Prototype) {
      return false;
    }

    const { declarations } = sym;

    const filteredDeclarations = (declarations || []).filter((d) => {
      const sf = d.getSourceFile();
      return this.shouldSerializeSourceFile(sf);
    });

    for (const fd of filteredDeclarations) {
      if (this.shouldSerializeSourceFile(fd.getSourceFile())) {
        return true;
      }
    }
    return false;
  }

  public shouldSerializeTypeDetails(
    type: ts.Type,
    symbol: ts.Symbol | undefined = type.symbol as ts.Symbol | undefined,
  ): boolean {
    if (!symbol) {
      return false;
    }
    return this.shouldSerializeSymbolDetails(symbol);
  }

  @memoize
  // eslint-disable-next-line class-methods-use-this
  public shouldSerializeSourceFile(sf: ts.SourceFile): boolean {
    return sf.fileName.replace(/[/\\]+/g, '').indexOf('typescriptlib') < 0;
  }
}
