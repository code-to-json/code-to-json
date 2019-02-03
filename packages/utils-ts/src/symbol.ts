import * as ts from 'typescript';
import { isErroredType } from './typeguards';

export interface SymbolRelevantTypes {
  symbolType?: ts.Type;
  valueDeclarationType?: ts.Type;
  otherDeclarationTypes?: Map<ts.Declaration, ts.Type | undefined>;
}

/**
 * Produce a string representation of the types associated with a symbol
 *
 * @param checker type-checker
 * @param t relevant types for a symbol
 * @private
 */
export function getTypeStringForRelevantTypes(
  checker: ts.TypeChecker,
  t: SymbolRelevantTypes,
): string {
  const parts: string[] = [];
  const { symbolType, valueDeclarationType } = t;
  if (symbolType) {
    parts.push(checker.typeToString(symbolType));
  }
  if (valueDeclarationType) {
    parts.push(checker.typeToString(valueDeclarationType));
  }
  if (parts.length === 0) {
    const { otherDeclarationTypes } = t;
    if (otherDeclarationTypes) {
      for (const [, v] of otherDeclarationTypes) {
        if (v) {
          parts.push(checker.typeToString(v));
        }
      }
    }
  }
  return parts.join('\n');
}

/**
 * Obtain the relevant types associated with a symbol
 *
 * @param checker type-checker
 * @param symbol symbol whose types are desired
 * @private
 */
export function getRelevantTypesForSymbol(
  checker: ts.TypeChecker,
  symbol: ts.Symbol,
): SymbolRelevantTypes | undefined {
  const st: SymbolRelevantTypes = {};

  const symbolType = checker.getDeclaredTypeOfSymbol(symbol);
  if (!isErroredType(symbolType)) {
    st.symbolType = symbolType;
  }

  const { valueDeclaration, declarations } = symbol;

  if (valueDeclaration) {
    const valueDeclarationType = checker.getTypeOfSymbolAtLocation(symbol, valueDeclaration);
    if (!isErroredType(valueDeclarationType)) {
      st.valueDeclarationType = valueDeclarationType;
    }
  }

  if (declarations && declarations.length > 0) {
    const m = new Map<ts.Declaration, ts.Type | undefined>(
      declarations.map(
        (d): [ts.Declaration, ts.Type | undefined] => {
          const dtype = checker.getTypeOfSymbolAtLocation(symbol, d);

          if (!isErroredType(dtype)) {
            return [d, dtype];
          }
          return [d, undefined];
        },
      ),
    );
    if (m.size > 0) {
      st.otherDeclarationTypes = m;
    }
  }

  if (Object.keys(st).length === 0) {
    return undefined;
  }
  return st;
}
