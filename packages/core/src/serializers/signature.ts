import * as ts from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import Ref, { isRef } from '../processing-queue/ref';

export interface SerializedSignature {
  parameters: Array<Ref<'symbol'>>;
  returnType: string; // TODO: type?
  documentation: string;
}

/** Serialize a signature (call or construct) */
export default function serializeSignature(
  signature: ts.Signature,
  checker: ts.TypeChecker,
  q: ProcessingQueue
): SerializedSignature {
  return {
    parameters: signature.parameters
      .map(p => q.queue(p, 'symbol'))
      .filter(isRef),
    returnType: checker.typeToString(signature.getReturnType()),
    documentation: ts.displayPartsToString(
      signature.getDocumentationComment(checker)
    )
  };
}
