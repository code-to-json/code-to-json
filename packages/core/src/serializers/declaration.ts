import { Declaration, TypeChecker } from 'typescript';
import Collector from '../collector';
import { DeclarationRef, SerializedDeclaration, SourceFileRef } from '../types';
import serializeNode from './node';

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
