import { flagsToString } from '@code-to-json/utils';
import * as ts from 'typescript';
import { ProcessingQueue } from '../processing-queue';
import Ref from '../processing-queue/ref';

export default function serializeType(
  typ: ts.Type,
  checker: ts.TypeChecker,
  ref: Ref<'type'>,
  queue: ProcessingQueue
) {
  const { flags, aliasSymbol, aliasTypeArguments, symbol } = typ;

  const typeData = {
    id: ref.id,
    thing: 'type' as 'type',
    symbol: queue.queue(symbol, 'symbol'),
    typeString: checker.typeToString(typ),
    aliasTypeArguments:
      aliasTypeArguments &&
      aliasTypeArguments.map(ata => queue.queue(ata, 'type')),
    aliasSymbol: aliasSymbol && queue.queue(aliasSymbol, 'symbol'),
    flags: flagsToString(flags, 'type')
  };
  return typeData;
}
