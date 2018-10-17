import * as ts from 'typescript';
import serializeSymbol from './symbol';
import serializeSignature from './signature';
/** Serialize a class symbol information */
export default function serializeClass(
  symbol: ts.Symbol,
  checker: ts.TypeChecker
) {
  let details = serializeSymbol(symbol, checker) as any;

  // Get the construct signatures
  let constructorType = checker.getTypeOfSymbolAtLocation(
    symbol,
    symbol.valueDeclaration!
  );
  details.constructors = constructorType
    .getConstructSignatures()
    .map(s => serializeSignature(s, checker));
  return details;
}
