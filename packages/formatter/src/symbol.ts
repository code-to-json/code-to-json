import { SerializedSymbol, SerializedType, SymbolRef, WalkerOutputData } from '@code-to-json/core';
import { conditionallyMergeTransformed, isDefined, refId } from '@code-to-json/utils';
import { DataCollector } from './data-collector';
import { convertLocation } from './location';
import resolveReference from './resolve-reference';
import { FormattedSymbol, FormattedSymbolKind, FormattedSymbolRef } from './types';
import { formatSymbolRefMap } from './utils';

const IRRELEVANT_SYMBOL_FLAGS: string[] = ['Transient'];

const SYMBOL_KIND_MAP: { [k: string]: FormattedSymbolKind } = {
  ValueModule: FormattedSymbolKind.module,
  Class: FormattedSymbolKind.class,
  Interface: FormattedSymbolKind.interface,
  TypeAlias: FormattedSymbolKind.typeAlias,
  TypeParameter: FormattedSymbolKind.typeParameter,
  Property: FormattedSymbolKind.property,
  Function: FormattedSymbolKind.function,
  Method: FormattedSymbolKind.method,
  BlockScopedVariable: FormattedSymbolKind.variable,
  RegularEnum: FormattedSymbolKind.enum,
  ConstEnum: FormattedSymbolKind.constEnum,
  EnumMember: FormattedSymbolKind.enumMember,
  TypeLiteral: FormattedSymbolKind.typeLiteral,
};

function determineSymbolKind(symbol: SerializedSymbol): FormattedSymbolKind {
  const { flags } = symbol;
  const filteredFlags = flags.filter(f => IRRELEVANT_SYMBOL_FLAGS.indexOf(f) < 0);
  const kinds = filteredFlags.map(f => {
    if (SYMBOL_KIND_MAP[f]) {
      return SYMBOL_KIND_MAP[f];
    }
    throw new Error(`Could not determine symbol kind\n${JSON.stringify(symbol, null, '  ')}`);
  });

  switch (kinds.length) {
    case 1:
      return kinds[0];
    case 0:
      throw new Error(`Empty symbol flags ${JSON.stringify(symbol, null, '  ')}`);
    default:
      if (
        kinds.length === 2 &&
        kinds.includes(FormattedSymbolKind.interface) &&
        kinds.includes(FormattedSymbolKind.variable)
      ) {
        return FormattedSymbolKind.interface;
      }
      throw new Error(
        `Multiple kinds identified: ${kinds.join(', ')}\n ${JSON.stringify(symbol, null, '  ')}`,
      );
  }
}

function formatSymbolDecorators(
  wo: WalkerOutputData,
  collector: DataCollector,
  decorators?: SymbolRef[],
): Pick<FormattedSymbol, 'decorators'> {
  if (!decorators) {
    return {};
  }
  const out: Pick<FormattedSymbol, 'decorators'> = {
    decorators: decorators
      .map(d => collector.queue(resolveReference(wo, d), 's'))
      .filter(isDefined),
  };
  return out;
}

type MODIFIER_PROPERTIES =
  | 'isExported'
  | 'accessModifier'
  | 'isStatic'
  | 'isConst'
  | 'isAsync'
  | 'isReadOnly';

function formatSymbolModifiers(modifiers?: string[]): Pick<FormattedSymbol, MODIFIER_PROPERTIES> {
  if (!modifiers) {
    return {};
  }
  const out: Pick<FormattedSymbol, MODIFIER_PROPERTIES> = {};
  modifiers.forEach(m => {
    switch (m) {
      case 'export':
      case 'default':
        out.isExported = true;
        break;
      case 'protected':
      case 'public':
      case 'private':
        out.accessModifier = m;
        break;
      case 'const':
        out.isConst = true;
        break;
      case 'readonly':
        out.isReadOnly = true;
        break;
      case 'static':
        out.isStatic = true;
        break;
      case 'async':
        out.isAsync = true;
        break;
      case 'FirstContextualKeyword':
        break;
      default:
        throw new Error(`Unexpected modifier: ${m}`);
    }
  });
  return out;
}

function formatSymbolDocumentation(
  symbol: SerializedSymbol | undefined,
): Pick<FormattedSymbol, 'comment' | 'jsDocTags'> | undefined {
  if (!symbol || (!symbol.comment && !symbol.jsDocTags)) {
    return undefined;
  }
  const out: Pick<FormattedSymbol, 'comment' | 'jsDocTags'> = {};
  const { comment, jsDocTags } = symbol;
  if (comment) {
    out.comment = comment;
  }
  if (jsDocTags) {
    out.jsDocTags = jsDocTags;
  }
  return out;
}

export default function formatSymbol(
  wo: WalkerOutputData,
  symbol: Readonly<SerializedSymbol>,
  ref: FormattedSymbolRef,
  collector: DataCollector,
): FormattedSymbol {
  const {
    name,
    flags: _rawFlags,
    exports,
    type: typeRef,
    modifiers,
    decorators,
    // heritageClauses,
    location,
    members,
    sourceFile,
    globalExports,
    external,
    documentation,
    isAbstract,
    text,
    relatedSymbols,
  } = symbol;
  const id = refId(ref);
  const info: FormattedSymbol = {
    id,
    kind: determineSymbolKind(symbol),
    text,
    name: name || '(anonymous)',
  };
  Object.assign(
    info,
    formatSymbolModifiers(modifiers),
    formatSymbolDecorators(wo, collector, decorators),
    formatSymbolDocumentation(symbol),
  );
  if (relatedSymbols) {
    info.related = relatedSymbols
      .map(rs => collector.queue(resolveReference(wo, rs), 's'))
      .filter(isDefined);
  }
  if (isAbstract) {
    info.isAbstract = true;
  }
  if (_rawFlags.indexOf('Transient') >= 0) {
    info.isTransient = true;
  }
  if (location) {
    info.location = convertLocation(wo, collector, location);
  }
  if (external) {
    info.external = external;
  }
  if (sourceFile) {
    info.sourceFile = collector.queue(resolveReference(wo, sourceFile), 'f');
  }
  let type: SerializedType | undefined;
  if (typeRef) {
    type = resolveReference(wo, typeRef);
    info.type = collector.queue(type, 't');
  }
  conditionallyMergeTransformed(info, documentation, 'documentation', d => d);
  // conditionallyMergeTransformed(info, heritageClauses, 'heritageClauses', hc =>
  //   hc.map(h => h.clauseType),
  // );
  // tslint:disable-next-line:no-commented-code
  // conditionallyMergeTransformed(info, _rawFlags, 'flags', f => f, f => !!(f && f.length > 0));

  conditionallyMergeTransformed(
    info,
    exports,
    'exports',
    ex => formatSymbolRefMap(ex, wo, collector),
    ex => !!(ex && Object.keys(ex).length > 0),
  );
  conditionallyMergeTransformed(
    info,
    globalExports,
    'globalExports',
    ex => formatSymbolRefMap(ex, wo, collector),
    ex => !!(ex && Object.keys(ex).length > 0),
  );
  conditionallyMergeTransformed(
    info,
    members,
    'members',
    mem => formatSymbolRefMap(mem, wo, collector),
    mem => !!(mem && Object.keys(mem).length > 0),
  );
  if (
    info.kind === FormattedSymbolKind.class &&
    type &&
    type.constructorSignatures &&
    type.constructorSignatures.length > 0
  ) {
    const instanceType = resolveReference(wo, type.constructorSignatures[0].returnType!);
    info.instanceType = collector.queue(instanceType, 't');
  }

  return info;
}
