import { isRef, refId } from '@code-to-json/utils';
import { Type, TypeChecker } from 'typescript';
import { Flags, flagsToString, getObjectFlags } from '../flags';
import { ProcessingQueue } from '../processing-queue';
import { SymbolRef, TypeRef } from '../processing-queue/ref';
import { SerializedEntity } from '../types';

export interface SerializedType extends SerializedEntity<'type'> {
  symbol?: SymbolRef;
  typeString: string;
  aliasTypeArguments?: TypeRef[];
  aliasSymbol?: SymbolRef;
  objectFlags?: Flags;
  defaultType?: TypeRef;
  numberIndexType?: TypeRef;
  constraint?: TypeRef;
  stringIndexType?: TypeRef;
  properties?: SymbolRef[];
  baseTypes?: TypeRef[];
}

/**
 * Serialize a Type to a POJO
 * @param typ Type to serialize
 * @param checker A type-checker
 * @param ref Reference to the type being serialized
 * @param queue Processing queue
 */
export default function serializeType(
  typ: Type,
  checker: TypeChecker,
  ref: TypeRef,
  queue: ProcessingQueue
): SerializedType {
  const { flags, aliasSymbol, aliasTypeArguments, symbol } = typ;
  const objFlags = getObjectFlags(typ);
  const typeData: SerializedType = {
    id: refId(ref),
    entity: 'type',
    typeString: checker.typeToString(typ),
    aliasTypeArguments:
      aliasTypeArguments &&
      aliasTypeArguments.map(ata => queue.queue(ata, 'type', checker)).filter(isRef),
    aliasSymbol: aliasSymbol && queue.queue(aliasSymbol, 'symbol', checker),
    flags: flagsToString(flags, 'type'),
    objectFlags: objFlags ? flagsToString(objFlags, 'object') : undefined
  };

  const numberIdxType = typ.getNumberIndexType();
  if (numberIdxType) {
    typeData.numberIndexType = queue.queue(numberIdxType, 'type', checker);
  }
  const stringIdxType = typ.getNumberIndexType();
  if (stringIdxType) {
    typeData.stringIndexType = queue.queue(stringIdxType, 'type', checker);
  }
  const defaultType = typ.getDefault();
  if (defaultType) {
    typeData.defaultType = queue.queue(defaultType, 'type', checker);
  }
  const constraint = typ.getConstraint();
  if (constraint) {
    typeData.constraint = queue.queue(constraint, 'type', checker);
  }
  const baseTypes = typ.getBaseTypes();
  if (baseTypes) {
    typeData.baseTypes =
      baseTypes.length > 0
        ? baseTypes.map(bt => queue.queue(bt, 'type', checker)).filter(isRef)
        : undefined;
  }
  const properties = typ.getProperties();
  if (properties && properties.length > 0) {
    typeData.properties = properties.map(sym => queue.queue(sym, 'symbol', checker)).filter(isRef);
  }
  if (symbol) {
    typeData.symbol = queue.queue(symbol, 'symbol', checker);
  }
  return typeData;
}
