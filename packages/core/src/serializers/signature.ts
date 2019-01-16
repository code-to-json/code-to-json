import { isRef } from '@code-to-json/utils';
import { displayPartsToString, Signature, TypeChecker } from 'typescript';
import { SerializedSignature } from '../types/serialized-entities';
import { Collector } from '../types/walker';

/**
 * Serialize a ts.Signature to JSON
 *
 * @param signature signature to serialize
 * @param checker type-checker
 * @param c walker collector
 */
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
        ? parameters.map(p => q.queue(p, 'symbol')).filter(isRef)
        : undefined,
    typeParameters: typeParameters
      ? typeParameters.map(p => q.queue(p, 'type')).filter(isRef)
      : undefined,
    // declaration: declaration ? q.queue(declaration, 'declaration') : undefined,
    returnType: q.queue(signature.getReturnType(), 'type'),
    comment: displayPartsToString(signature.getDocumentationComment(checker)),
  };
}
