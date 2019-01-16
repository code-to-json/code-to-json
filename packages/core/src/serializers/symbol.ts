import { parseCommentString } from '@code-to-json/comments';
import { conditionallyMergeTransformed, isRef, refId } from '@code-to-json/utils';
import { flagsToString, mapUem, relevantTypeForSymbol } from '@code-to-json/utils-ts';
import * as ts from 'typescript';
import { Queue } from '../processing-queue';
import { SymbolRef } from '../types/ref';
import { SerializedSymbol } from '../types/serialized-entities';
import { Collector } from '../types/walker';
import serializeLocation from './location';
import serializeSignature from './signature';

function appendSymbolMap(
  uem: ts.UnderscoreEscapedMap<ts.Symbol> | undefined,
  q: Queue,
): SymbolRef[] | undefined {
  if (uem && uem.size > 0) {
    return mapUem(uem, (val: ts.Symbol) => q.queue(val, 'symbol')).filter(isRef);
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
  const { exports, globalExports, members, flags, valueDeclaration: _valDecl, name } = symbol;
  const valueDeclaration = _valDecl as ts.Declaration | undefined;
  const details: SerializedSymbol = {
    id: refId(ref),
    entity: 'symbol',
    name,
    flags: flagsToString(flags, 'symbol'),
  };

  const typ = relevantTypeForSymbol(checker, symbol);
  if (valueDeclaration && valueDeclaration.getSourceFile().isDeclarationFile) {
    details.external = true;
  }
  details.type = q.queue(typ, 'type');
  if (members) {
    details.members = appendSymbolMap(members, q);
  }
  conditionallyMergeTransformed(details, exports, 'exports', exps => appendSymbolMap(exps, q));
  conditionallyMergeTransformed(details, globalExports, 'globalExports', gexps =>
    appendSymbolMap(gexps, q),
  );
  const docComment = symbol.getDocumentationComment(checker);
  if (docComment.length > 0) {
    details.comment = ts.displayPartsToString(docComment);
  }
  if (valueDeclaration) {
    const { jsDoc }: { jsDoc?: ts.Node[] } = valueDeclaration as any;
    if (jsDoc) {
      const commentText: string = jsDoc[0].getText();
      details.documentation = parseCommentString(commentText);
    }
    const { modifiers, decorators, pos, end } = valueDeclaration;
    const valDeclType = checker.getTypeOfSymbolAtLocation(symbol, valueDeclaration);
    const sourceFile = valueDeclaration.getSourceFile();
    details.location = serializeLocation(sourceFile, pos, end, q);
    details.sourceFile = q.queue(sourceFile, 'sourceFile');
    conditionallyMergeTransformed(details, modifiers, 'modifiers', mods =>
      mods.map(m => ts.SyntaxKind[m.kind]),
    );
    conditionallyMergeTransformed(details, decorators, 'decorators', decs =>
      decs.map(d => ts.SyntaxKind[d.kind]),
    );

    const constructorSignatures = valDeclType
      .getConstructSignatures()
      .map(s => serializeSignature(s, checker, c));
    if (constructorSignatures && constructorSignatures.length > 0) {
      details.constructorSignatures = constructorSignatures;
    }
    const callSignatures = valDeclType
      .getCallSignatures()
      .map(s => serializeSignature(s, checker, c));
    if (callSignatures && callSignatures.length > 0) {
      details.callSignatures = callSignatures;
    }
  }
  const jsDocTags = symbol.getJsDocTags();
  if (jsDocTags.length > 0) {
    details.jsDocTags = [...jsDocTags];
  }
  return details;
}
