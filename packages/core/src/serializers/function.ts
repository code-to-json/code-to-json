import * as ts from 'typescript';
import serializeSymbol from './symbol';
import serializeSignature from './signature';
/** Serialize a class symbol information */
export default function serializeFunction(
  symbol: ts.Symbol,
  checker: ts.TypeChecker
) {
  let details = serializeSymbol(symbol, checker) as any;

  let functionType = checker.getTypeOfSymbolAtLocation(
    symbol,
    symbol.valueDeclaration
  );
  details.signatures = functionType
    .getCallSignatures()
    .map(s => serializeSignature(s, checker));
  return details;
}
