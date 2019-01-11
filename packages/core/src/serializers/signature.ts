import { isRef } from '@code-to-json/utils/lib/src/deferred-processing/ref';
import { displayPartsToString, Signature, TypeChecker } from 'typescript';
import Collector from '../collector';
import { DeclarationRef, SymbolRef, TypeRef } from '../processing-queue/ref';

export interface SerializedSignature {
  parameters?: SymbolRef[];
  typeParameters?: TypeRef[];
  declaration?: DeclarationRef;
  returnType?: TypeRef;
  comment?: string;
}

/** Serialize a signature (call or construct) */
export default function serializeSignature(
  signature: Signature,
  checker: TypeChecker,
  c: Collector,
): SerializedSignature {
  const { parameters, typeParameters } = signature;
  const { queue: q } = c;
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
    comment: displayPartsToString(signature.getDocumentationComment(checker)),
  };
}
