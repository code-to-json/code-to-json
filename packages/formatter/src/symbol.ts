import { SerializedSymbol, SerializedType, SymbolRef, WalkerOutputData } from '@code-to-json/core';
import { conditionallyMergeTransformed, isDefined, refId } from '@code-to-json/utils';
import { DataCollector } from './data-collector';
import formatFlags from './flags';
import { convertLocation } from './location';
import resolveReference from './resolve-reference';
import { FormattedSymbol, FormattedSymbolRef } from './types';
import { formatSymbolRefMap } from './utils';

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

function formatSymbolTypes(
  wo: WalkerOutputData,
  symbol: Readonly<SerializedSymbol>,
  collector: DataCollector,
): Pick<FormattedSymbol, 'type' | 'valueType' | 'otherDeclarationTypes'> {
  const {
    symbolType: symbolTypeRef,
    valueDeclarationType: valueDeclarationTypeRef,
    otherDeclarationTypes: otherDeclarationTypeRefs,
  } = symbol;
  const out: Pick<FormattedSymbol, 'type' | 'valueType' | 'otherDeclarationTypes'> = {};

  let symbolType: SerializedType | undefined;
  if (symbolTypeRef) {
    symbolType = resolveReference(wo, symbolTypeRef);
    out.type = collector.queue(symbolType, 't');
  }
  let valueDeclarationType: SerializedType | undefined;
  if (valueDeclarationTypeRef) {
    valueDeclarationType = resolveReference(wo, valueDeclarationTypeRef);
    out.valueType = collector.queue(valueDeclarationType, 't');
  }
  if (otherDeclarationTypeRefs) {
    out.otherDeclarationTypes = otherDeclarationTypeRefs
      .map(dtr => ({
        declaration: collector.queue(resolveReference(wo, dtr.declaration), 'd')!,
        type: dtr.type ? collector.queue(resolveReference(wo, dtr.type), 't') : undefined,
      }))
      .filter(isDefined);
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
    flags,
    exports,

    modifiers,
    decorators,
    location,
    members,
    globalExports,
    external,
    documentation,
    isAbstract,
    text,
    valueDeclaration,
    relatedSymbols,
  } = symbol;
  const id = refId(ref);
  const info: FormattedSymbol = {
    id,
    flags: formatFlags(flags),
    kind: 'symbol',
    text,
    name: name || '(anonymous)',
    valueDeclaration: valueDeclaration
      ? collector.queue(resolveReference(wo, valueDeclaration), 'd')
      : undefined,
  };
  Object.assign(
    info,
    formatSymbolModifiers(modifiers),
    formatSymbolDecorators(wo, collector, decorators),
    formatSymbolDocumentation(symbol),
    formatSymbolTypes(wo, symbol, collector),
  );
  if (relatedSymbols) {
    info.related = relatedSymbols
      .map(rs => collector.queue(resolveReference(wo, rs), 's'))
      .filter(isDefined);
  }
  if (isAbstract) {
    info.isAbstract = true;
  }
  if (location) {
    info.location = convertLocation(wo, collector, location);
  }
  if (external) {
    info.external = external;
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

  return info;
}
