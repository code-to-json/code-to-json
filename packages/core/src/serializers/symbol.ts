import { parseCommentString } from '@code-to-json/comments';
import { forEach, refId } from '@code-to-json/utils';
import {
  flagsToString,
  getFirstIdentifier,
  mapDict,
  relevantDeclarationForSymbol,
  relevantTypeForSymbol,
} from '@code-to-json/utils-ts';
import * as ts from 'typescript';
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
  c: Collector,
): SerializedSymbol {
  const { queue: q } = c;
  const { flags, name, exports: exportedSymbols } = symbol;

  // starting point w/ minimal (and mandatory) information
  const serialized: SerializedSymbol = {
    id: refId(ref),
    entity: 'symbol',
    name,
    flags: flagsToString(flags, 'symbol'),
    type: q.queue(relevantTypeForSymbol(checker, symbol), 'type'),
  };

  if (!c.cfg.shouldSerializeSymbolDetails(symbol)) {
    return serialized;
  }

  if (exportedSymbols) {
    serialized.exports = mapDict(exportedSymbols, exp => q.queue(exp, 'symbol'));
  }
  const decl = relevantDeclarationForSymbol(symbol);
  if (decl) {
    if (symbol.getJsDocTags().length > 0 || symbol.getDocumentationComment(checker).length > 0) {
      const txt = extractDocumentationText(decl);
      if (typeof txt === 'string') {
        serialized.documentation = parseCommentString(txt);
      }
    }
    const { pos, end } = decl;
    const sourceFile = decl.getSourceFile();
    serialized.sourceFile = q.queue(sourceFile, 'sourceFile');
    serialized.location = serializeLocation(sourceFile, pos, end, q);
  }

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
