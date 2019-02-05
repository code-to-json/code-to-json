import { isDefined } from '@code-to-json/utils';
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
  const { hasRestParameter }: { hasRestParameter: boolean } = signature as any;
  const { parameters, typeParameters, declaration } = signature;
  const typePredicate: ts.TypePredicate = (checker as any).getTypePredicateOfSignature(signature);

  const out: SerializedSignature = {
    returnType: q.queue(signature.getReturnType(), 'type'),
    hasRestParameter,
    modifiers:
      !declaration || !declaration.modifiers
        ? undefined
        : declaration.modifiers.map((m) => m.getText()),
    typeParameters:
      !typeParameters || typeParameters.length === 0
        ? undefined
        : typeParameters.map((tp) => q.queue(tp, 'type')).filter(isDefined),
    parameters:
      !parameters || parameters.length === 0
        ? undefined
        : parameters.map((p) => q.queue(p, 'symbol')).filter(isDefined),
    text: checker.signatureToString(signature),
    typePredicate: !typePredicate ? undefined : q.queue(typePredicate.type, 'type'),
  };

  return out;
}
