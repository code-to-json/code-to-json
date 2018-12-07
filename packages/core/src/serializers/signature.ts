import { isRef } from '@code-to-json/utils/lib/src/deferred-processing/ref';
import { displayPartsToString, Signature, TypeChecker } from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import { DeclarationRef, SymbolRef, TypeRef } from '../processing-queue/ref';

export interface SerializedSignature {
  parameters?: SymbolRef[];
  typeParameters?: TypeRef[];
  declaration?: DeclarationRef;
  returnType?: TypeRef;
  documentation?: string;
}

/** Serialize a signature (call or construct) */
export default function serializeSignature(
  signature: Signature,
  checker: TypeChecker,
  q: ProcessingQueue
): SerializedSignature {
  const { parameters, typeParameters } = signature;

  return {
    parameters:
      parameters && parameters.length > 0
        ? parameters.map(p => q.queue(p, 'symbol', checker)).filter(isRef)
        : undefined,
    typeParameters: typeParameters
      ? typeParameters.map(p => q.queue(p, 'type', checker)).filter(isRef)
      : undefined,
    // declaration: declaration ? q.queue(declaration, 'declaration', checker) : undefined,
    returnType: q.queue(signature.getReturnType(), 'type', checker),
    documentation: displayPartsToString(signature.getDocumentationComment(checker))
  };
}
