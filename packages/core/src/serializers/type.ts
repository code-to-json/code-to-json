import { isRef, refId } from '@code-to-json/utils';
import * as ts from 'typescript';
import Collector from '../collector';
import { Flags, flagsToString, getObjectFlags } from '../flags';
import { SymbolRef, TypeRef } from '../processing-queue/ref';
import { SerializedEntity } from '../types';

function getTsLibFilename(fileName: string): string | undefined {
  const [, libName] = fileName.split(/\/node_modules\/typescript\/lib\//);
  return typeof libName !== 'undefined' && libName.endsWith('.d.ts') ? libName : undefined;
}

export interface SerializedCustomType
  extends Pick<SerializedBuiltInType, Exclude<keyof SerializedBuiltInType, 'isBuiltIn'>> {
  symbol?: SymbolRef;
  aliasTypeArguments?: TypeRef[];
  aliasSymbol?: SymbolRef;
  defaultType?: TypeRef;
  numberIndexType?: TypeRef;
  constraint?: TypeRef;
  stringIndexType?: TypeRef;
  properties?: SymbolRef[];
  baseTypes?: TypeRef[];
  isBuiltIn: false;
}
export interface SerializedBuiltInType extends SerializedEntity<'type'> {
  objectFlags?: Flags;
  isBuiltIn: true;
  libName?: string;
  typeString: string;
  moduleName?: string;
}

export type SerializedType = SerializedBuiltInType | SerializedCustomType;

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

/**
 * Serialize a Type to a POJO
 * @param typ Type to serialize
 * @param checker A type-checker
 * @param ref Reference to the type being serialized
 * @param queue Processing queue
 */
// tslint:disable-next-line:cognitive-complexity
export default function serializeType(
  typ: ts.Type,
  checker: ts.TypeChecker,
  ref: TypeRef,
  c: Collector,
): SerializedType {
  const { flags: rawFlags, aliasSymbol, aliasTypeArguments, symbol } = typ;
  const id = refId(ref);
  const flags = flagsToString(rawFlags, 'type');
  const typeString = checker.typeToString(typ);
  const objFlags = getObjectFlags(typ);
  const objectFlags = objFlags ? flagsToString(objFlags, 'object') : undefined;

  if (!symbol) {
    // core types
    const toReturn = {
      id,
      entity: 'type',
      isBuiltIn: true,
      typeString,
    } as SerializedBuiltInType;
    if (flags) {
      toReturn.flags = flags;
    }
    return toReturn;
  }
  const decl = relevantDeclarationForSymbol(symbol);
  if (decl) {
    const { fileName, moduleName } = decl.getSourceFile();
    const libName = getTsLibFilename(fileName);
    if (libName) {
      // lib types
      const toReturn = {
        entity: 'type',
        isBuiltIn: true,
        id,
        libName,
        moduleName,
        typeString,
      } as SerializedBuiltInType;
      if (flags) {
        toReturn.flags = flags;
      }
      return toReturn;
    }
  } // TODO: handle else clause (what does it mean to have no declaration?)
  const { queue: q } = c;
  const typeData: SerializedType = {
    id,
    entity: 'type',
    isBuiltIn: false,
    typeString,
    aliasTypeArguments:
      aliasTypeArguments &&
      aliasTypeArguments.map(ata => q.queue(ata, 'type', checker)).filter(isRef),
    aliasSymbol: aliasSymbol && q.queue(aliasSymbol, 'symbol', checker),
    objectFlags,
  };
  if (flags) {
    typeData.flags = flags;
  }

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
