import { Declaration, TypeChecker } from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import { DeclarationRef, SourceFileRef } from '../processing-queue/ref';
import serializeNode, { SerializedNode } from './node';

export interface SerializedDeclaration
  extends Pick<SerializedNode, Exclude<keyof SerializedNode, 'thing'>> {
  thing: 'declaration';
}

/**
 * Serialize a Declaration to a POJO
 * @param decl Declaration to serialize
 */
export default function serializeDeclaration(
  decl: Declaration,
  checker: TypeChecker,
  ref: DeclarationRef | SourceFileRef,
  _queue: ProcessingQueue
): SerializedDeclaration {
  const basicInfo: SerializedDeclaration = {
    ...serializeNode(decl, checker, ref, _queue),
    thing: 'declaration'
  };
  return basicInfo;
}
