import { Flags, flagsToString, mapUem } from '@code-to-json/utils';
import * as ts from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import {
  DeclarationRef,
  isRef,
  SymbolRef,
  TypeRef
} from '../processing-queue/ref';
import serializeSignature, { SerializedSignature } from './signature';

export interface SerializedSymbol {
  thing: 'symbol';
  id: string;
  name: string;
  documentation: string;
  flags?: Flags;
  type?: TypeRef;
  members?: SymbolRef[];
  exports?: SymbolRef[];
  declarations: DeclarationRef[];
  constructorSignatures?: SerializedSignature[];
  callSignatures?: SerializedSignature[];
}

export default function serializeSymbol(
  symbol: ts.Symbol,
  checker: ts.TypeChecker,
  ref: SymbolRef,
  queue: ProcessingQueue
): SerializedSymbol {
  const { exports, members, flags, declarations, valueDeclaration } = symbol;
  // Get the construct signatures

  const typ = checker.getTypeOfSymbolAtLocation(
    symbol,
    symbol.valueDeclaration!
  );

  const details: SerializedSymbol = {
    id: ref.id,
    thing: 'symbol',
    name: symbol.getName(),
    documentation: ts.displayPartsToString(
      symbol.getDocumentationComment(checker)
    ),
    flags: flagsToString(flags, 'symbol'),
    type: queue.queue(typ, 'type', checker),
    members:
      members &&
      mapUem(members, (val: ts.Symbol) =>
        queue.queue(val, 'symbol', checker)
      ).filter(isRef),
    exports:
      exports &&
      mapUem(exports, (val: ts.Symbol) =>
        queue.queue(val, 'symbol', checker)
      ).filter(isRef),
    declarations:
      declarations &&
      declarations
        .map((d) => queue.queue(d, 'declaration', checker))
        .filter(isRef)
  };
  if (valueDeclaration) {
    const valDeclType = checker.getTypeOfSymbolAtLocation(
      symbol,
      valueDeclaration
    );
    details.constructorSignatures = valDeclType
      .getConstructSignatures()
      .map((s) => serializeSignature(s, checker, queue));
    details.callSignatures = valDeclType
      .getCallSignatures()
      .map((s) => serializeSignature(s, checker, queue));
  }
  return details;
}
