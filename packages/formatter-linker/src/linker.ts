import {
  CodePoisition,
  CodeRange,
  FormattedDeclarationRef,
  FormattedHeritageClause,
  FormattedSignature,
  FormattedSourceFile,
  FormattedSymbol,
  FormattedType,
  FormattedTypeRef,
  FormatterOutputData,
} from '@code-to-json/formatter';
import { isDefined, Ref, refId, refType } from '@code-to-json/utils';
import { Dict } from '@mike-north/types';
import { createLinkedFormattedRefResolver, resolveRefDict, resolveRefList } from './ref-resolver';
import {
  LinkedFormattedDeclaration,
  LinkedFormattedOutputData,
  LinkedFormattedRefResolver,
  LinkedFormattedSignature,
  LinkedFormattedSignatureRelationships,
  LinkedFormattedSourceFile,
  LinkedFormattedSourceFileRelationships,
  LinkedFormattedSymbol,
  LinkedFormattedSymbolRelationships,
  LinkedFormattedType,
  LinkedFormattedTypeRelationships,
  MaybeLinkedFormattedOutputData,
} from './types';
import { pruneUndefinedValues } from './utils';

function linkSignature(
  sig: FormattedSignature & LinkedFormattedSignature | undefined,
  res: LinkedFormattedRefResolver,
): void {
  if (!sig) {
    return;
  }
  const { parameters, typeParameters, returnType } = sig;
  const newData: LinkedFormattedSignatureRelationships = {
    parameters: !parameters
      ? undefined
      : parameters.map(p => ({
          name: p.name,
          type: p.type ? res(p.type) : undefined,
        })),
    typeParameters: !typeParameters ? undefined : resolveRefList(typeParameters, res),
    returnType: !returnType ? undefined : res(returnType),
  };
  Object.assign(sig, pruneUndefinedValues(newData));
}

function linkCodePositionOrRange(
  pos: CodePoisition | CodeRange | undefined,
  res: LinkedFormattedRefResolver,
): void {
  if (!pos) {
    return;
  }
  // eslint-disable-next-line no-param-reassign
  pos[0] = res(pos[0]) as any;
}

function linkType(
  res: LinkedFormattedRefResolver,
  type?: LinkedFormattedType & FormattedType,
): void {
  if (!type) {
    return;
  }
  const {
    symbol,
    constraint,
    properties,
    baseTypes,
    thisType,
    numberIndexType,
    stringIndexType,
    defaultType,
    callSignatures,
    constructorSignatures,
    typeParameters,
    types,
    conditionalInfo,
  } = type;
  const newData: LinkedFormattedTypeRelationships = {
    symbol: !symbol ? undefined : res(symbol),
    constraint: res(constraint),
    properties: resolveRefDict(properties, res),
    baseTypes: resolveRefList(baseTypes, res),
    thisType: res(thisType),
    numberIndexType: res(numberIndexType),
    stringIndexType: res(stringIndexType),
    defaultType: res(defaultType),
    typeParameters: resolveRefList(typeParameters, res),
    types: resolveRefList(types, res),
  };
  [constructorSignatures, callSignatures].filter(isDefined).forEach(sigList => {
    sigList.forEach(sig =>
      linkSignature(sig as LinkedFormattedSignature & FormattedSignature, res),
    );
  });
  if (conditionalInfo) {
    Object.assign(type.conditionalInfo, {
      extendsType: res(conditionalInfo.extendsType),
      checkType: res(conditionalInfo.checkType),
      falseType: res(conditionalInfo.falseType),
      trueType: res(conditionalInfo.trueType),
    });
  }

  Object.assign(type, pruneUndefinedValues(newData));
}

function linkSourceFile(
  res: LinkedFormattedRefResolver,
  sym?: LinkedFormattedSourceFile & FormattedSourceFile,
): void {
  if (!sym) {
    return;
  }
  const newData: LinkedFormattedSourceFileRelationships = {
    symbol: res(sym.symbol),
  };
  Object.assign(sym, pruneUndefinedValues(newData));
}

function linkSymbol(
  res: LinkedFormattedRefResolver,
  sym?: LinkedFormattedSymbol & FormattedSymbol,
): void {
  if (!sym) {
    return;
  }
  const {
    otherDeclarationTypes,
    decorators,
    exports,
    globalExports,
    members,
    properties,
    type,
    valueType,
    related,
    valueDeclaration,
    heritageClauses,
  } = sym;
  const newData: LinkedFormattedSymbolRelationships = {
    otherDeclarationTypes: !otherDeclarationTypes
      ? undefined
      : otherDeclarationTypes
          .map(odt => ({
            declaration: res(
              (odt.declaration as any) as FormattedDeclarationRef,
            ) as LinkedFormattedDeclaration,
            type: res((odt.type as any) as FormattedTypeRef) as LinkedFormattedType | undefined,
          }))
          .filter(isDefined),
    decorators: resolveRefList(decorators, res),
    exports: resolveRefDict(exports, res),
    globalExports: resolveRefDict(globalExports, res),
    members: resolveRefDict(members, res),
    properties: resolveRefDict(properties, res),
    type: res(type),
    valueType: res(valueType),
    related: resolveRefList(related, res),
    valueDeclaration: res(valueDeclaration),
  };
  if (sym.location) {
    linkCodePositionOrRange(sym.location, res);
  }
  if (heritageClauses) {
    newData.heritageClauses = heritageClauses.map((hc: FormattedHeritageClause) => ({
      kind: hc.kind,
      types: resolveRefList(hc.types, res) || [],
    }));
  }

  Object.assign(sym, pruneUndefinedValues(newData));
}

// tslint:disable-next-line:no-empty
export function linkFormatterData(unlinked: FormatterOutputData): LinkedFormattedOutputData {
  const out = JSON.parse(JSON.stringify(unlinked)) as MaybeLinkedFormattedOutputData;
  const { symbols, types, sourceFiles } = out;
  const resolver = createLinkedFormattedRefResolver(out);
  Object.keys(symbols).forEach(symKey => linkSymbol(resolver, symbols[symKey]));
  Object.keys(types).forEach(typeKey => linkType(resolver, types[typeKey]));
  Object.keys(sourceFiles).forEach(sourceFileKey =>
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
