import { parseCommentString } from '@code-to-json/comments';
import { forEach, isDefined, refId } from '@code-to-json/utils';
import {
  filterDict,
  flagsToString,
  getFirstIdentifier,
  isAbstractDeclaration,
  isErroredType,
  mapDict,
  modifiersToStrings,
  relevantDeclarationForSymbol,
  relevantTypeForSymbol,
} from '@code-to-json/utils-ts';
import * as ts from 'typescript';
import { Queue } from '../processing-queue';
import { SymbolRef } from '../types/ref';
import { SerializedSymbol } from '../types/serialized-entities';
import { Collector } from '../types/walker';
import serializeLocation from './location';

function walkToNodeWithJSDoc(node: ts.Node): (ts.Node & { jsDoc?: ts.Node[] }) | undefined {
  let relevantNode: (ts.Node & { jsDoc?: ts.Node[] }) | undefined = node;
  while (relevantNode) {
    const { jsDoc } = relevantNode;
    if (jsDoc && jsDoc instanceof Array && jsDoc.length > 0) {
      return relevantNode;
    }
    relevantNode = relevantNode.parent;
  }
  return relevantNode;
}

function extractDocumentationText(decl: ts.Declaration): string | undefined {
  const n = walkToNodeWithJSDoc(decl);
  if (!n) {
    return undefined;
  }
  const { jsDoc }: { jsDoc?: ts.Node[] } = n;
  if (jsDoc && jsDoc.length > 0) {
    const commentText: string = jsDoc[0].getText();
    return commentText;
  }
  return undefined;
}

type SYMBOL_EXTENDED_DECLARATION_PROPS = 'jsDocTags' | 'documentation' | 'sourceFile' | 'location';

function serializeExtendedSymbolDeclarationData(
  symbol: ts.Symbol,
  decl: ts.Declaration | undefined,
  checker: ts.TypeChecker,
  c: Collector,
): Pick<SerializedSymbol, SYMBOL_EXTENDED_DECLARATION_PROPS> {
  if (!decl) {
    return {};
  }
  const { queue: q } = c;
  const serialized: Pick<SerializedSymbol, SYMBOL_EXTENDED_DECLARATION_PROPS> = {};

  if (symbol.getJsDocTags().length > 0 || symbol.getDocumentationComment(checker).length > 0) {
    const txt = extractDocumentationText(decl);
    serialized.jsDocTags = symbol.getJsDocTags().map(t => ({ name: t.name, text: t.text }));
    if (typeof txt === 'string') {
      serialized.documentation = parseCommentString(txt);
    }
  }
  const { pos, end } = decl;
  const sourceFile = decl.getSourceFile();
  if (c.cfg.shouldSerializeSourceFile(sourceFile)) {
    serialized.sourceFile = q.queue(sourceFile, 'sourceFile');
    serialized.location = serializeLocation(sourceFile, pos, end, q);
  }
  return serialized;
}

function serializeExports(
  sym: ts.Symbol,
  checker: ts.TypeChecker,
  c: Collector,
): Pick<SerializedSymbol, 'exports'> | undefined {
  if (!c.cfg.shouldSerializeSymbolDetails(checker, sym)) {
    return undefined;
  }
  const { exports: exportSymbols } = sym;
  if (!exportSymbols) {
    return {};
  }
  const filteredExports = filterDict(exportSymbols, e => !(e.flags & ts.SymbolFlags.Prototype));
  if (Object.keys(filteredExports).length === 0) {
    return {};
  }

  return { exports: mapDict(filteredExports, exp => c.queue.queue(exp, 'symbol')) };
}

function serializeMembers(
  sym: ts.Symbol,
  checker: ts.TypeChecker,
  c: Collector,
): Pick<SerializedSymbol, 'members'> | undefined {
  if (!c.cfg.shouldSerializeSymbolDetails(checker, sym)) {
    return undefined;
  }
  const { members } = sym;
  if (!members) {
    return {};
  }
  const filteredMembers = filterDict(
    members,
    e => !(e.flags & (ts.SymbolFlags.Constructor | ts.SymbolFlags.Signature)),
  );
  if (Object.keys(filteredMembers).length === 0) {
    return {};
  }
  return { members: mapDict(filteredMembers, exp => c.queue.queue(exp, 'symbol')) };
}

function handleRelatedEntities(
  _symbol: ts.Symbol,
  _ref: SymbolRef,
  relatedEntities: ts.Symbol[] | undefined,
  q: Queue,
): Pick<SerializedSymbol, 'relatedSymbols'> | undefined {
  if (!relatedEntities) {
    return undefined;
  }
  const relatedSymbols = relatedEntities
    .map(relatedSym => q.queue(relatedSym, 'symbol'))
    .filter(isDefined);

  return { relatedSymbols };
}

type SYMBOL_BASIC_DECLARATION_PROPS = 'modifiers' | 'decorators' | 'isAbstract';

function serializeBasicSymbolDeclarationData(
  _symbol: ts.Symbol,
  decl: ts.Declaration | undefined,
  checker: ts.TypeChecker,
  c: Collector,
): Pick<SerializedSymbol, SYMBOL_BASIC_DECLARATION_PROPS> | undefined {
  if (!decl) {
    return undefined;
  }
  const out: Pick<SerializedSymbol, SYMBOL_BASIC_DECLARATION_PROPS> = {};
  const { modifiers, decorators } = decl;
  if (modifiers) {
    out.modifiers = modifiersToStrings(modifiers);
  }
  if (decorators) {
    out.decorators = decorators
      .map(d => c.queue.queue(checker.getSymbolAtLocation(d.expression), 'symbol'))
      .filter(isDefined);
  }

  if (isAbstractDeclaration(decl)) {
    out.isAbstract = true;
  }

  return out;
}

/**
 * Serialize a ts.Symbol to JSON
 *
 * @param symbol Symbol to serialize
 * @param checker an instance of the TS type checker
 * @param ref Reference to the symbol
 * @param c walker collector
 */
export default function serializeSymbol(
  symbol: ts.Symbol,
  checker: ts.TypeChecker,
  ref: SymbolRef,
  relatedEntities: ts.Symbol[] | undefined,
  c: Collector,
): SerializedSymbol {
  const { queue: q } = c;
  const { flags, name } = symbol;
  // starting point w/ minimal (and mandatory) information
  const type = relevantTypeForSymbol(checker, symbol);
  if (type && isErroredType(type)) {
    throw new Error(`Unable to determine type for symbol ${checker.symbolToString(symbol)}`);
  }
  const id = refId(ref);
  const serialized: SerializedSymbol = {
    id,
    entity: 'symbol',
    name,
    text: checker.symbolToString(symbol),
    flags: flagsToString(flags, 'symbol') || [],
    type: q.queue(type, 'type'),
    ...handleRelatedEntities(symbol, ref, relatedEntities, q),
  };
  const decl = relevantDeclarationForSymbol(symbol);

  Object.assign(serialized, serializeBasicSymbolDeclarationData(symbol, decl, checker, c));

  Object.assign(
    serialized,
    serializeExports(symbol, checker, c),
    serializeExtendedSymbolDeclarationData(symbol, decl, checker, c),
    serializeMembers(symbol, checker, c),
  );

  forEach(symbol.declarations, d => {
    // Type queries are too far resolved when we just visit the symbol's type
    //  (their type resolved directly to the member deeply referenced)
    // So to get the intervening symbols, we need to check if there's a type
    // query node on any of the symbol's declarations and get symbols there
    if ((d as any).type && (d as any).type.kind === ts.SyntaxKind.TypeQuery) {
      const query = (d as any).type as ts.TypeQueryNode;
      const entity = checker.getSymbolAtLocation(getFirstIdentifier(query.exprName));
      // todo: what do we do about this symbol?
      q.queue(entity, 'symbol');
    }
  });

  return serialized;
}
