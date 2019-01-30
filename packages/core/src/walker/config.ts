import { UnreachableError } from '@code-to-json/utils';
import {
  filterDict,
  ModulePathNormalizer,
  PASSTHROUGH_MODULE_PATH_NORMALIZER,
  relevantDeclarationForSymbol,
  relevantTypeForSymbol,
} from '@code-to-json/utils-ts';
import { Dict } from '@mike-north/types';
import * as ts from 'typescript';
import { DEFAULT_WALKER_OPTIONS, WalkerOptions } from './options';

function isInternalSymbol(sym: ts.Symbol): boolean {
  const banned = filterDict((ts.InternalSymbolName as unknown) as Dict<string>, s =>
    s.startsWith('__'),
  );
  const values = Object.keys(banned).map(k => banned[k]);
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
      return !sf.isDeclarationFile && sf.fileName.indexOf('node_modules') < 0;
    }
    throw new UnreachableError(includeDeclarations);
  }

  // eslint-disable-next-line class-methods-use-this
  public shouldSerializeSymbolDetails(checker: ts.TypeChecker, sym?: ts.Symbol): boolean {
    if (!sym || isInternalSymbol(sym)) {
      return false;
    }
    const decl = relevantDeclarationForSymbol(sym);
    if (!decl && sym.flags & ts.SymbolFlags.Prototype) {
      return false;
    }
    const type = relevantTypeForSymbol(checker, sym);
    if (type && type.symbol && type.symbol.valueDeclaration) {
      return this.shouldSerializeSourceFile(type.symbol.valueDeclaration.getSourceFile());
    }
    if (decl) {
      return this.shouldSerializeSourceFile(decl.getSourceFile());
    }
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  public shouldSerializeTypeDetails(
    _checker: ts.TypeChecker,
    type: ts.Type,
    symbol: ts.Symbol | undefined = type.symbol as ts.Symbol | undefined,
  ): boolean {
    if (!symbol) {
      return false;
    }
    const decl = relevantDeclarationForSymbol(symbol);

    if (!decl) {
      return true;
    }
    const sf = decl.getSourceFile();
    return sf.fileName.replace(/[/\\]+/g, '').indexOf('typescriptlib') < 0;
  }

  // eslint-disable-next-line class-methods-use-this
  public shouldSerializeSourceFile(sf: ts.SourceFile): boolean {
    return !sf.isDeclarationFile;
  }
}
