import * as ts from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import Ref from '../processing-queue/ref';
import { EntityMap } from '../types';

export interface SerializedDeclaration {
  thing: 'declaration';
  id: string;
  text: string;
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
  // const name = isNamedDeclaration(decl) && decl.name;
  // const sym = checker.getSymbolAtLocation(name || decl);
  // if (sym) {
  //   if (name) {
  //     return {
  //       name: name.getText()
  //     };
  //   } else {
  //     return serializeSymbol(sym, checker, walkData);
  //   }
  // } else {
  //   const typ = checker.getTypeAtLocation(name || decl);
  //   if (typ) {
  //     return serializeType(typ, checker, walkData);
  //   }
  //   debugger;
  // }
  return details;
}
