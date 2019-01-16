import * as ts from 'typescript';

export function relevantTypeForSymbol(checker: ts.TypeChecker, symbol: ts.Symbol): ts.Type {
  const { valueDeclaration: _valDecl, flags } = symbol;
  const valueDeclaration = _valDecl as ts.Declaration | undefined;
  if (valueDeclaration) {
    return checker.getTypeOfSymbolAtLocation(symbol, valueDeclaration);
  }
  const declarations = symbol.getDeclarations();
  if (declarations && declarations.length > 0) {
    return checker.getTypeAtLocation(declarations[0]);
  }
  // eslint-disable-next-line no-bitwise
  if (flags & ts.SymbolFlags.Prototype) {
    return checker.getDeclaredTypeOfSymbol(symbol);
  }
  throw new Error(`Could not determine type of symbol ${symbol.name}`);
}

/**
 * Find the relevant declaration for a ts.Symbol
 * @param sym Symbol whose declaration is desired
 */
export function relevantDeclarationForSymbol(sym: ts.Symbol): ts.Declaration | undefined {
  const { valueDeclaration } = sym;
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
