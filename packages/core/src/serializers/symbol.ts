import { Flags, flagsToString, mapUem } from '@code-to-json/utils';
import * as ts from 'typescript';
import { isRef, ProcessingQueue, Ref } from '../processing-queue';
import { EntityMap } from '../types';
import { SerializedDeclaration } from './declaration';
import serializeSignature, { SerializedSignature } from './signature';

export interface SerializedSymbol {
  thing: 'symbol';
  id: string;
  name: string;
  documentation: string;
  flags?: Flags;
  type?: Ref<EntityMap, 'type'>;
  members?: Array<Ref<EntityMap, 'symbol'>>;
  exports?: Array<Ref<EntityMap, 'symbol'>>;
  declarations: Array<Ref<EntityMap, 'declaration'>>;
  constructorSignatures?: SerializedSignature[];
  callSignatures?: SerializedSignature[];
}

export default function serializeSymbol(
  symbol: ts.Symbol,
  checker: ts.TypeChecker,
  ref: Ref<EntityMap, 'symbol'>,
  queue: ProcessingQueue<EntityMap>
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
    type: queue.queue(typ, 'type'), // v.visit(typ),
    members:
      members &&
      mapUem(members, (val: ts.Symbol) => queue.queue(val, 'symbol')).filter(
        isRef
      ),
    exports:
      exports &&
      mapUem(exports, (val: ts.Symbol) => queue.queue(val, 'symbol')).filter(
        isRef
      ),
    declarations:
      declarations &&
      declarations.map(d => queue.queue(d, 'declaration')).filter(isRef)
  };
  if (valueDeclaration) {
    const valDeclType = checker.getTypeOfSymbolAtLocation(
      symbol,
      valueDeclaration
    );
    details.constructorSignatures = valDeclType
      .getConstructSignatures()
      .map(s => serializeSignature(s, checker, queue));
    details.callSignatures = valDeclType
      .getCallSignatures()
      .map(s => serializeSignature(s, checker, queue));
  }
  return details;
}
