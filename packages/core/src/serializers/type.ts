import { Flags, flagsToString } from '@code-to-json/utils';
import * as ts from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import { isRef, SymbolRef, TypeRef } from '../processing-queue/ref';

export interface SerializedType {
  thing: 'type';
  id: string;
  symbol?: SymbolRef;
  typeString: string;
  aliasTypeArguments?: TypeRef[];
  aliasSymbol?: SymbolRef;
  flags?: Flags;
}

export default function serializeType(
  typ: ts.Type,
  checker: ts.TypeChecker,
  ref: TypeRef,
  queue: ProcessingQueue
): SerializedType {
  const { flags, aliasSymbol, aliasTypeArguments, symbol } = typ;

  const typeData = {
    id: ref.id,
    thing: 'type' as 'type',
    symbol: queue.queue(symbol, 'symbol', checker),
    typeString: checker.typeToString(typ),
    aliasTypeArguments:
      aliasTypeArguments &&
      aliasTypeArguments
        .map((ata) => queue.queue(ata, 'type', checker))
        .filter(isRef),
    aliasSymbol: aliasSymbol && queue.queue(aliasSymbol, 'symbol', checker),
    flags: flagsToString(flags, 'type')
  };
  return typeData;
}
