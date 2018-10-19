import { isNamedDeclaration } from '@code-to-json/utils/lib/guards';
import * as ts from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import Ref from '../processing-queue/ref';

export interface SerializedDeclaration {
  thing: 'declaration';
  id: string;
  text: string;
  name?: string;
}

export default function serializeDeclaration(
  decl: ts.Declaration,
  checker: ts.TypeChecker,
  ref: Ref<'declaration'>,
  queue: ProcessingQueue
): SerializedDeclaration {
  const details: SerializedDeclaration = {
    id: ref.id,
    thing: 'declaration',
    text: decl.getText()
  };
  const name = isNamedDeclaration(decl) && decl.name;
  const sym = checker.getSymbolAtLocation(name || decl);
  if (sym && name) {
    details.name = name.getText();
  }
  return details;
}
