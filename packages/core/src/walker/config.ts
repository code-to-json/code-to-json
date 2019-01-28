import { UnreachableError } from '@code-to-json/utils';
import {
  filterDict,
  ModulePathNormalizer,
  PASSTHROUGH_MODULE_PATH_NORMALIZER,
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
  public shouldSerializeSymbolDetails(
    checker: ts.TypeChecker,
    sym?: ts.Symbol,
    type?: ts.Type,
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
    } else if (type && type.symbol && type.symbol.valueDeclaration) {
      return this.shouldSerializeSourceFile(type.symbol.valueDeclaration.getSourceFile());
    } else {
      return this.shouldSerializeSourceFile(decl.getSourceFile());
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public shouldSerializeType(_checker: ts.TypeChecker, _type: ts.Type, symbol: ts.Symbol): boolean {
    const { valueDeclaration } = symbol;
    if (!valueDeclaration) {
      return true;
    }
    const sf = symbol.valueDeclaration.getSourceFile();
    return sf.fileName.replace(/[/\\/]+/g, '').indexOf('typescriptlib') < 0;
  }

  // eslint-disable-next-line class-methods-use-this
  public shouldSerializeSourceFile(sf: ts.SourceFile): boolean {
    return !sf.isDeclarationFile;
  }
}
