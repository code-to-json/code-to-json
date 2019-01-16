import { Declaration, TypeChecker } from 'typescript';
import { DeclarationRef, SourceFileRef } from '../types/ref';
import { SerializedDeclaration } from '../types/serialized-entities';
import { Collector } from '../types/walker';
import serializeNode from './node';

/**
 * Serialize a Declaration to a POJO
 * @param decl Declaration to serialize
 * @param checker type checker
 * @param ref reference to the declaration
 * @param c walker collector
 */
export default function serializeDeclaration(
  decl: Declaration,
  checker: TypeChecker,
  ref: DeclarationRef | SourceFileRef,
  c: Collector,
): SerializedDeclaration {
  const basicInfo: SerializedDeclaration = {
    ...serializeNode(decl, checker, ref, c),
    entity: 'declaration',
  };
  return basicInfo;
}
