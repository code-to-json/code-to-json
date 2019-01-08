import { isRef, refId } from '@code-to-json/utils';
import { Type, TypeChecker } from 'typescript';
import Collector from '../collector';
import { Flags, flagsToString, getObjectFlags } from '../flags';
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
  c: Collector,
): SerializedType {
  const { flags, aliasSymbol, aliasTypeArguments, symbol } = typ;
  const { queue: q } = c;
  const objFlags = getObjectFlags(typ);
  const typeData: SerializedType = {
    id: refId(ref),
    entity: 'type',
    typeString: checker.typeToString(typ),
    aliasTypeArguments:
      aliasTypeArguments &&
      aliasTypeArguments.map(ata => q.queue(ata, 'type', checker)).filter(isRef),
    aliasSymbol: aliasSymbol && q.queue(aliasSymbol, 'symbol', checker),
    flags: flagsToString(flags, 'type'),
    objectFlags: objFlags ? flagsToString(objFlags, 'object') : undefined,
  };

  const numberIdxType = typ.getNumberIndexType();
  if (numberIdxType) {
    typeData.numberIndexType = q.queue(numberIdxType, 'type', checker);
  }
  const stringIdxType = typ.getNumberIndexType();
  if (stringIdxType) {
    typeData.stringIndexType = q.queue(stringIdxType, 'type', checker);
  }
  const defaultType = typ.getDefault();
  if (defaultType) {
    typeData.defaultType = q.queue(defaultType, 'type', checker);
  }
  const constraint = typ.getConstraint();
  if (constraint) {
    typeData.constraint = q.queue(constraint, 'type', checker);
  }
  const baseTypes = typ.getBaseTypes();
  if (baseTypes) {
    typeData.baseTypes =
      baseTypes.length > 0
        ? baseTypes.map(bt => q.queue(bt, 'type', checker)).filter(isRef)
        : undefined;
  }
  const properties = typ.getProperties();
  if (properties && properties.length > 0) {
    typeData.properties = properties.map(sym => q.queue(sym, 'symbol', checker)).filter(isRef);
  }
  if (symbol) {
    typeData.symbol = q.queue(symbol, 'symbol', checker);
  }
  return typeData;
}
