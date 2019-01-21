import * as debug from 'debug';
import * as ts from 'typescript';

const log = debug('code-to-json:utils-ts');
/**
 * Find the relevant declaration for a ts.Symbol
 * @param sym Symbol whose declaration is desired
 */
export function relevantDeclarationForSymbol(sym?: ts.Symbol): ts.Declaration | undefined {
  if (!sym) {
    return undefined;
  }
  const { valueDeclaration } = sym as { valueDeclaration?: ts.Declaration };
  if (valueDeclaration) {
    return valueDeclaration;
  }
  const allDeclarations = sym.getDeclarations();
  if (allDeclarations && allDeclarations.length > 0) {
    // TODO: properly handle >1 declaration case
    return allDeclarations[0];
  }
  return undefined;
}

export function relevantTypeForSymbol(
  checker: ts.TypeChecker,
  symbol: ts.Symbol,
): ts.Type | undefined {
  const { valueDeclaration: _valDecl } = symbol;
  const valueDeclaration: ts.Declaration | undefined = _valDecl;

  if (symbol.flags & (ts.SymbolFlags.Variable | ts.SymbolFlags.Property)) {
    return checker.getTypeOfSymbolAtLocation(symbol, valueDeclaration);
  }
  if (valueDeclaration && ts.isSourceFile(valueDeclaration)) {
    return checker.getTypeOfSymbolAtLocation(symbol, valueDeclaration);
  }
  if (
    symbol.flags &
    (ts.SymbolFlags.Function |
      ts.SymbolFlags.Method |
      ts.SymbolFlags.Class |
      ts.SymbolFlags.Enum |
      ts.SymbolFlags.ValueModule)
  ) {
    if (valueDeclaration) {
      // ensure class is handled as `typeof Foo` instead of `Foo`
      return checker.getTypeOfSymbolAtLocation(symbol, valueDeclaration);
    }
    return checker.getTypeAtLocation(valueDeclaration);
  }
  if (symbol.flags & ts.SymbolFlags.EnumMember) {
    return checker.getTypeAtLocation(valueDeclaration);
  }
  if (symbol.flags & ts.SymbolFlags.Accessor) {
    return checker.getTypeOfSymbolAtLocation(symbol, valueDeclaration);
  }
  if (symbol.flags & ts.SymbolFlags.Alias) {
    return checker.getDeclaredTypeOfSymbol(symbol);
  }
  if (symbol.flags & ts.SymbolFlags.TypeParameter) {
    return checker.getDeclaredTypeOfSymbol(symbol);
  }
  if (
    symbol.flags &&
    ts.SymbolFlags.TypeLiteral &&
    symbol.declarations &&
    symbol.declarations.length > 0
  ) {
    // TODO: handle >1 case
    return checker.getTypeAtLocation(symbol.declarations[0]);
  }
  const lastResort = checker.getDeclaredTypeOfSymbol(symbol);

  log(`LAST RESORT: ${checker.symbolToString(symbol)} --> ${checker.typeToString(lastResort)}`);
  return lastResort;
}
