import { isRef } from '@code-to-json/utils';
import { TypeMapper } from '@code-to-json/utils-ts';
import * as ts from 'typescript';
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
  signature: ts.Signature,
  checker: ts.TypeChecker,
  c: Collector,
): SerializedSignature {
  const { queue: q } = c;
  const out: SerializedSignature = {
    returnType: q.queue(signature.getReturnType(), 'type'),
  };
  const { parameters, typeParameters } = signature;
  const typePredicate: ts.TypePredicate = (checker as any).getTypePredicateOfSignature(signature);
  if (typePredicate) {
    q.queue(typePredicate.type, 'type');
  }

  if (typeParameters && typeParameters.length > 0) {
    out.typeParameters = typeParameters.map(tp => q.queue(tp, 'type')).filter(isRef);
  }
  if (parameters && parameters.length > 0) {
    out.parameters = parameters.map(p => q.queue(p, 'symbol')).filter(isRef);
  }
  // tslint:disable-next-line:no-commented-code
  // visitType(getRestTypeOfSignature(signature));

  return out;
}
