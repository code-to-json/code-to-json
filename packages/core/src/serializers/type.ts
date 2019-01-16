import { isRef, isTruthy, refId } from '@code-to-json/utils';
import { flagsToString, getObjectFlags, getTsLibFilename } from '@code-to-json/utils-ts';
import * as ts from 'typescript';
import Collector from '../collector';
import { ProcessingQueue } from '../processing-queue';
import { TypeRef } from '../types/ref';
import {
  SerializedBuiltInType,
  SerializedCoreType,
  SerializedCustomType,
  SerializedType,
} from '../types/serialized-entities';

/**
 * Find the relevant declaration for a ts.Symbol
 * @param sym Symbol whose declaration is desired
 */
function relevantDeclarationForSymbol(sym: ts.Symbol): ts.Declaration | undefined {
  const { valueDeclaration } = sym;
  if (valueDeclaration) {
    return valueDeclaration;
  }
  const allDeclarations = sym.getDeclarations();
  if (allDeclarations && allDeclarations.length > 0) {
    // TODO: properly handle >1 declaration case
    return allDeclarations[0];
  }
  return undefined;
}

function serializeCoreType(
  typ: ts.Type,
  ref: TypeRef,
  checker: ts.TypeChecker,
  q: ProcessingQueue,
): SerializedCoreType {
  const { flags: rawFlags, aliasSymbol, aliasTypeArguments } = typ;
  const id = refId(ref);
  const flags = flagsToString(rawFlags, 'type');
  const typeString = checker.typeToString(typ);
  const objFlags = getObjectFlags(typ);
  const objectFlags = objFlags ? flagsToString(objFlags, 'object') : undefined;

  const defaultType = typ.getDefault();
  const typeData: SerializedCoreType = {
    id,
    entity: 'type',
    typeKind: 'core',
    typeString,
    flags,
    objectFlags,
    aliasTypeArguments:
      aliasTypeArguments &&
      aliasTypeArguments.map(ata => q.queue(ata, 'type', checker)).filter(isRef),
    aliasSymbol: aliasSymbol && q.queue(aliasSymbol, 'symbol', checker),
  };
  if (defaultType) {
    typeData.defaultType = q.queue(defaultType, 'type', checker);
  }
  const constraint = typ.getConstraint();
  if (constraint) {
    typeData.constraint = q.queue(constraint, 'type', checker);
  }
  return typeData;
}

function serializeBuiltInType(
  typ: ts.Type,
  ref: TypeRef,
  checker: ts.TypeChecker,
  decl: ts.Declaration,
  q: ProcessingQueue,
): SerializedBuiltInType {
  const { fileName, moduleName } = decl.getSourceFile();
  const libName = getTsLibFilename(fileName);
  const t: SerializedBuiltInType = {
    ...serializeCoreType(typ, ref, checker, q),
    typeKind: 'built-in',
    libName,
    moduleName,
  };

  const defaultType = typ.getDefault();
  if (defaultType) {
    t.default = q.queue(defaultType, 'type', checker);
  }
  const numberIdxType = typ.getNumberIndexType();
  if (numberIdxType) {
    t.numberIndexType = q.queue(numberIdxType, 'type', checker);
  }
  const stringIdxType = typ.getStringIndexType();
  if (stringIdxType) {
    t.stringIndexType = q.queue(stringIdxType, 'type', checker);
  }
  const baseTypes = typ.getBaseTypes();
  if (baseTypes) {
    t.baseTypes =
      baseTypes.length > 0
        ? baseTypes.map(bt => q.queue(bt, 'type', checker)).filter(isRef)
        : undefined;
  }
  return t;
}

function serializeCustomType(
  typ: ts.Type,
  ref: TypeRef,
  checker: ts.TypeChecker,
  decl: ts.Declaration,
  q: ProcessingQueue,
): SerializedCustomType {
  const { symbol } = typ;

  const typeData: SerializedCustomType = {
    ...serializeBuiltInType(typ, ref, checker, decl, q),
    typeKind: 'custom',
  };

  const properties = typ.getProperties();
  if (properties && properties.length > 0) {
    typeData.properties = properties.map(sym => q.queue(sym, 'symbol', checker)).filter(isRef);
  }
  typeData.symbol = q.queue(symbol, 'symbol', checker);
  return typeData;
}

/**
 * Serialize a Type to a POJO
 * @param typ Type to serialize
 * @param checker A type-checker
 * @param ref Reference to the type being serialized
 * @param queue Processing queue
 */
export default function serializeType(
  typ: ts.Type,
  checker: ts.TypeChecker,
  ref: TypeRef,
  c: Collector,
): SerializedType {
  const { symbol } = typ;
  let serializedType: SerializedType;
  if (!symbol) {
    // core types
    serializedType = serializeCoreType(typ, ref, checker, c.queue);
  } else {
    const decl = relevantDeclarationForSymbol(symbol);

    if (decl) {
      const { fileName } = decl.getSourceFile();
      const libName = getTsLibFilename(fileName);
      if (libName) {
        serializedType = serializeBuiltInType(typ, ref, checker, decl, c.queue);
      } else {
        serializedType = serializeCustomType(typ, ref, checker, decl, c.queue);
      }
    } else {
      throw new Error(`No symbol or declaration for type: ${checker.typeToString(typ)}`);
    }
  }
  if (typ.isClassOrInterface()) {
    const { typeParameters } = typ;
    if (typeParameters) {
      serializedType.aliasTypeArguments = typeParameters
        .map(tp => c.queue.queue(tp, 'type', checker))
        .filter(isTruthy);
    }
  }
  return serializedType;
}
