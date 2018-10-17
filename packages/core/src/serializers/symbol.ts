import * as ts from 'typescript';

/** Serialize a symbol into a json object */
export default function serializeSymbol(
  symbol: ts.Symbol,
  checker: ts.TypeChecker
) {
  return {
    name: symbol.getName(),
    documentation: ts.displayPartsToString(
      symbol.getDocumentationComment(checker)
    ),
    type: checker.typeToString(
      checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
    )
  };
}
