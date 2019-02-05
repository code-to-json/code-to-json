import {
  SerializedSourceFile,
  SerializedSymbol,
  SerializedType,
  WalkerOutputData,
} from '@code-to-json/core';
import {
  SerializedCodePoisition,
  SerializedCodeRange,
  SerializedFileReference,
  SerializedSignature,
} from '@code-to-json/core/lib/src/types/serialized-entities';
import { isDefined, Ref, refId, refType } from '@code-to-json/utils';
import { Dict } from '@mike-north/types';
import { createLinkedRefResolver, resolveRefDict, resolveRefList } from './ref-resolver';
import {
  LinkedFileReference,
  LinkedRefResolver,
  LinkedSignature,
  LinkedSignatureRelationships,
  LinkedSourceFile,
  LinkedSourceFileRelationships,
  LinkedSymbol,
  LinkedSymbolRelationships,
  LinkedType,
  LinkedTypeRelationships,
  LinkedWalkerOutputData,
  MaybeLinkedWalkerOutputData,
} from './types';
import { pruneUndefinedValues } from './utils';

function linkSignature(
  sig: SerializedSignature & LinkedSignature | undefined,
  res: LinkedRefResolver,
): void {
  if (!sig) {
    return;
  }
  const newData: LinkedSignatureRelationships = {
    returnType: res(sig.returnType),
    typePredicate: res(sig.typePredicate),
    parameters: resolveRefList(sig.parameters, res),
    typeParameters: resolveRefList(sig.typeParameters, res),
  };
  Object.assign(sig, pruneUndefinedValues(newData));
}

function linkFileReference(
  fileRef: SerializedFileReference | LinkedFileReference | undefined,
  res: LinkedRefResolver,
): void {
  if (!fileRef) {
    return;
  }
  linkCodePositionOrRange(fileRef.location as SerializedCodeRange, res);
}

function linkCodePositionOrRange(
  pos: SerializedCodePoisition | SerializedCodeRange | undefined,
  res: LinkedRefResolver,
): void {
  if (!pos) {
    return;
  }
  // eslint-disable-next-line no-param-reassign
  pos[0] = res(pos[0]) as any;
}

function linkType(res: LinkedRefResolver, type?: LinkedType & SerializedType): void {
  if (!type) {
    return;
  }
  const newData: LinkedTypeRelationships = {
    numberIndexType: res(type.numberIndexType),
    stringIndexType: res(type.stringIndexType),
    default: res(type.default),

    types: resolveRefList(type.types, res),
    baseTypes: resolveRefList(type.baseTypes, res),
    symbol: res(type.symbol),
    target: res(type.target),
    relatedTypes: resolveRefList(type.relatedTypes, res),
    sourceFile: res(type.sourceFile),
    typeParameters: resolveRefList(type.typeParameters, res),
    constraint: res(type.constraint),
    templateType: res(type.templateType),
    thisType: res(type.thisType),
    modifiersType: res(type.modifiersType),
    aliasSymbol: res(type.aliasSymbol),
    defaultType: res(type.defaultType),
    simplified: res(type.simplified),
    indexType: res(type.indexType),
    objectType: res(type.objectType),
    properties: resolveRefDict(type.properties, res),
    // conditionalInfo?: LinkedTypeConditionInfo;
  };
  [type.constructorSignatures, type.callSignatures].filter(isDefined).forEach((sigList) => {
    sigList.forEach((sig) => linkSignature(sig as LinkedSignature & SerializedSignature, res));
  });
  if (type.conditionalInfo) {
    Object.assign(type.conditionalInfo, {
      extendsType: res(type.conditionalInfo.extendsType),
      checkType: res(type.conditionalInfo.checkType),
      falseType: res(type.conditionalInfo.falseType),
      trueType: res(type.conditionalInfo.trueType),
    });
  }
  linkCodePositionOrRange(type.location, res);

  Object.assign(type, pruneUndefinedValues(newData));
}

function linkSourceFile(
  res: LinkedRefResolver,
  sym?: LinkedSourceFile & SerializedSourceFile,
): void {
  if (!sym) {
    return;
  }
  const newData: LinkedSourceFileRelationships = {
    symbol: res(sym.symbol),
  };
  [sym.referencedFiles, sym.typeReferenceDirectives, sym.libReferenceDirectives]
    .filter(isDefined)
    .forEach((fileRefList) => {
      fileRefList.forEach((fr) => linkFileReference(fr, res));
    });
  Object.assign(sym, pruneUndefinedValues(newData));
}

function linkSymbol(res: LinkedRefResolver, sym?: LinkedSymbol & SerializedSymbol): void {
  if (!sym) {
    return;
  }
  const { symbolType, valueDeclaration, valueDeclarationType, exports, members, decorators, sourceFile, globalExports, relatedSymbols } = sym;
  const newData: LinkedSymbolRelationships = {
    symbolType: res(symbolType),
    valueDeclarationType: res(valueDeclarationType),
    exports: resolveRefDict(exports, res),
    members: resolveRefDict(members, res),
    decorators: resolveRefList(decorators, res),
    sourceFile: res(sourceFile),
    globalExports: resolveRefDict(globalExports, res),
    relatedSymbols: resolveRefList(relatedSymbols, res),
    valueDeclaration: res(valueDeclaration)
  };

  Object.assign(sym, pruneUndefinedValues(newData));
}

// tslint:disable-next-line:no-empty
export function linkWalkerOutputData(unlinked: WalkerOutputData): LinkedWalkerOutputData {
  const out = JSON.parse(JSON.stringify(unlinked)) as MaybeLinkedWalkerOutputData;
  const { symbols, types, sourceFiles } = out;
  const resolver = createLinkedRefResolver(out);
  Object.keys(symbols).forEach((symKey) => linkSymbol(resolver, symbols[symKey]));
  Object.keys(types).forEach((typeKey) => linkType(resolver, types[typeKey]));
  Object.keys(sourceFiles).forEach((sourceFileKey) =>
    linkSourceFile(resolver, sourceFiles[sourceFileKey]),
  );
  return out;
}

export function resolveReference<EntityMap, K extends keyof EntityMap>(
  multiStore: { [EMK in K]: Dict<EntityMap[EMK]> },
  ref: Ref<K>,
): EntityMap[K] | undefined {
  const kind = refType(ref);
  const id = refId(ref);
  return multiStore[kind][id];
}
