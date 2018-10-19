import { Flags, flagsToString } from '@code-to-json/utils';
import * as ts from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import Ref, { isRef } from '../processing-queue/ref';

export interface SerializedType {
  thing: 'type';
  id: string;
  symbol?: Ref<'symbol'>;
  typeString: string;
  aliasTypeArguments?: Array<Ref<'type'>>;
  aliasSymbol?: Ref<'symbol'>;
  flags?: Flags;
}

export default function serializeType(
  typ: ts.Type,
  checker: ts.TypeChecker,
  ref: Ref<'type'>,
  queue: ProcessingQueue
): SerializedType {
  const { flags, aliasSymbol, aliasTypeArguments, symbol } = typ;

  const typeData = {
    id: ref.id,
    thing: 'type' as 'type',
    symbol: queue.queue(symbol, 'symbol'),
    typeString: checker.typeToString(typ),
    aliasTypeArguments:
      aliasTypeArguments &&
      aliasTypeArguments.map((ata) => queue.queue(ata, 'type')).filter(isRef),
    aliasSymbol: aliasSymbol && queue.queue(aliasSymbol, 'symbol'),
    flags: flagsToString(flags, 'type')
  };
  return typeData;
}
