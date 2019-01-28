import { parseCommentString } from '@code-to-json/comments';
import { forEach, isDefined, isRef, refId } from '@code-to-json/utils';
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

type SYMBOL_DECLARATION_PROPS =
  | 'modifiers'
  | 'decorators'
  | 'jsDocTags'
  | 'documentation'
  | 'sourceFile'
  | 'location';

function serializeSymbolDeclarationData(
  symbol: ts.Symbol,
  decl: ts.Declaration | undefined,
  c: Collector,
  checker: ts.TypeChecker,
): Pick<SerializedSymbol, SYMBOL_DECLARATION_PROPS> {
  if (!decl) {
    return {};
  }
  const { queue: q } = c;
  const serialized: Pick<SerializedSymbol, SYMBOL_DECLARATION_PROPS> = {};
  const { modifiers, decorators } = decl;
  if (modifiers) {
    serialized.modifiers = modifiersToStrings(modifiers);
  }
  if (decorators) {
    serialized.decorators = decorators
      .map(d => q.queue(checker.getSymbolAtLocation(d.expression), 'symbol'))
      .filter(isDefined);
  }
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

function serializeExportedSymbols(
  syms: ts.UnderscoreEscapedMap<ts.Symbol> | undefined,
  q: Queue,
): Pick<SerializedSymbol, 'exports'> {
  if (!syms) {
    return {};
  }
  const filteredExports = filterDict(syms, e => !(e.flags & ts.SymbolFlags.Prototype));
  if (Object.keys(filteredExports).length === 0) {
    return {};
  }

  return { exports: mapDict(filteredExports, exp => q.queue(exp, 'symbol')) };
}

function serializeMemberSymbols(
  syms: ts.UnderscoreEscapedMap<ts.Symbol> | undefined,
  q: Queue,
): Pick<SerializedSymbol, 'members'> {
  if (!syms) {
    return {};
  }
  const filteredMembers = filterDict(
    syms,
    e => !(e.flags & (ts.SymbolFlags.Constructor | ts.SymbolFlags.Signature)),
  );
  if (Object.keys(filteredMembers).length === 0) {
    return {};
  }
  return { members: mapDict(filteredMembers, exp => q.queue(exp, 'symbol')) };
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
    .filter(isRef);

  return { relatedSymbols };
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
  const { flags, name, exports: exportedSymbols, members: memberSymbols } = symbol;
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
    flags: flagsToString(flags, 'symbol') || [],
    type: q.queue(type, 'type'),
    ...handleRelatedEntities(symbol, ref, relatedEntities, q),
  };
  const symbolString = checker.symbolToString(symbol);
  const typeString = type ? checker.typeToString(type) : undefined;
  if (symbolString) {
    serialized.symbolString = symbolString;
  }
  if (typeString) {
    serialized.typeString = typeString;
  }

  Object.assign(serialized, serializeExportedSymbols(exportedSymbols, q));

  const decl = relevantDeclarationForSymbol(symbol);
  if (decl && isAbstractDeclaration(decl)) {
    serialized.isAbstract = true;
  }
  if (!c.cfg.shouldSerializeSymbolDetails(checker, symbol, type, decl)) {
    return serialized;
  }

  Object.assign(
    serialized,
    serializeSymbolDeclarationData(symbol, decl, c, checker),
    serializeMemberSymbols(memberSymbols, q),
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
