import * as ts from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import { DeclarationRef, isRef, SymbolRef, TypeRef } from '../processing-queue/ref';

export interface SerializedSignature {
  parameters: SymbolRef[];
  typeParameters?: TypeRef[];
  declaration?: DeclarationRef;
  returnType: string; // TODO: type?
  documentation: string;
}

/** Serialize a signature (call or construct) */
export default function serializeSignature(
  signature: ts.Signature,
  checker: ts.TypeChecker,
  q: ProcessingQueue
): SerializedSignature {
  const { parameters, typeParameters, declaration } = signature;
  return {
    parameters: parameters.map(p => q.queue(p, 'symbol', checker)).filter(isRef),
    typeParameters: typeParameters
      ? typeParameters.map(p => q.queue(p, 'type', checker)).filter(isRef)
      : undefined,
    declaration: declaration ? q.queue(declaration, 'declaration', checker) : undefined,
    returnType: checker.typeToString(signature.getReturnType()),
    documentation: ts.displayPartsToString(signature.getDocumentationComment(checker))
  };
}
