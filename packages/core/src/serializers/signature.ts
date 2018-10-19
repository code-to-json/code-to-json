import * as ts from 'typescript';
import { isRef, ProcessingQueue, Ref } from '../processing-queue';
import { EntityMap } from '../types';
import { SerializedSymbol } from './symbol';

export interface SerializedSignature {
  parameters: Array<Ref<EntityMap, 'symbol'>>;
  returnType: string; // TODO: type?
  documentation: string;
}

/** Serialize a signature (call or construct) */
export default function serializeSignature(
  signature: ts.Signature,
  checker: ts.TypeChecker,
  q: ProcessingQueue<EntityMap>
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
