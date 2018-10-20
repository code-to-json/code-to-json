import { isNamedDeclaration } from '@code-to-json/utils/lib/guards';
import * as ts from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import { DeclarationRef } from '../processing-queue/ref';
import serializeNode from './node';

export interface SerializedDeclaration {
  thing: 'declaration';
  id: string;
  text: string;
  name?: string;
}

export default function serializeDeclaration(
  decl: ts.Declaration,
  checker: ts.TypeChecker,
  ref: DeclarationRef,
  _queue: ProcessingQueue
): SerializedDeclaration {
  return { ...serializeNode(decl, checker, ref, _queue), thing: 'declaration' };
}
