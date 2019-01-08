import { Declaration, TypeChecker } from 'typescript';
import Collector from '../collector';
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
  c: Collector,
): SerializedDeclaration {
  const basicInfo: SerializedDeclaration = {
    ...serializeNode(decl, checker, ref, c),
    thing: 'declaration',
  };
  return basicInfo;
}
