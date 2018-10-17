import * as ts from 'typescript';
import serializeSymbol from './symbol';

/** Serialize a signature (call or construct) */
export default function serializeSignature(
  signature: ts.Signature,
  checker: ts.TypeChecker
) {
  return {
    parameters: signature.parameters.map(s => serializeSymbol(s, checker)),
    returnType: checker.typeToString(signature.getReturnType()),
    documentation: ts.displayPartsToString(
      signature.getDocumentationComment(checker)
    )
  };
}
