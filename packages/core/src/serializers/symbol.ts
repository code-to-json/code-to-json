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
  /**
   * The typescript types lie here. symbol.valueDeclaration has the potential to be undefined
   * @example
   * ```ts
   *  export Dict<T> = {[k: string]: T | undefined}
   * ```
   */
  const valueDeclaration = _valDecl as ts.Declaration | undefined;

  // starting point w/ minimal (and mandatory) information
  const serialied: SerializedSymbol = {
    id: refId(ref),
    entity: 'symbol',
    name,
    flags: flagsToString(flags, 'symbol'),
  };

  // try to determine this symbol's type
  const typ = relevantTypeForSymbol(checker, symbol);

  // if we can identify a valueDeclaration and its source file is a declaration file, we can determine this type to be "external"
  if (valueDeclaration && valueDeclaration.getSourceFile().isDeclarationFile) {
    // TODO: does this really mean "external"? what about in-project declaration files
    serialied.external = true;
  }
  // queue the type for processing later
  serialied.type = q.queue(typ, 'type');

  /**
   * if the symbol has members, exports, globalExports create dictionaries for them, queue for later processing
   * and place them on the `serialized` object under appropriate property names
   */
  conditionallyMergeTransformed(serialied, members, 'members', mems => appendSymbolMap(mems, q));
  conditionallyMergeTransformed(serialied, exports, 'exports', exps => appendSymbolMap(exps, q));
  conditionallyMergeTransformed(serialied, globalExports, 'globalExports', gexps =>
    appendSymbolMap(gexps, q),
  );

  // TODO: update to new documentation strategy
  const docComment = symbol.getDocumentationComment(checker);
  if (docComment.length > 0) {
    serialied.comment = ts.displayPartsToString(docComment);
  }
  if (valueDeclaration) {
    const { jsDoc }: { jsDoc?: ts.Node[] } = valueDeclaration as any;
    if (jsDoc) {
      const commentText: string = jsDoc[0].getText();
      serialied.documentation = parseCommentString(commentText);
    }
    const { modifiers, decorators, pos, end } = valueDeclaration;
    const valDeclType = checker.getTypeOfSymbolAtLocation(symbol, valueDeclaration);
    const sourceFile = valueDeclaration.getSourceFile();
    serialied.location = serializeLocation(sourceFile, pos, end, q);
    serialied.sourceFile = q.queue(sourceFile, 'sourceFile');
    conditionallyMergeTransformed(serialied, modifiers, 'modifiers', mods =>
      mods.map(m => ts.SyntaxKind[m.kind]),
    );
    conditionallyMergeTransformed(serialied, decorators, 'decorators', decs =>
      decs.map(d => ts.SyntaxKind[d.kind]),
    );

    const constructorSignatures = valDeclType
      .getConstructSignatures()
      .map(s => serializeSignature(s, checker, c));
    if (constructorSignatures && constructorSignatures.length > 0) {
      serialied.constructorSignatures = constructorSignatures;
    }
    const callSignatures = valDeclType
      .getCallSignatures()
      .map(s => serializeSignature(s, checker, c));
    if (callSignatures && callSignatures.length > 0) {
      serialied.callSignatures = callSignatures;
    }
  }
  const jsDocTags = symbol.getJsDocTags();
  if (jsDocTags.length > 0) {
    serialied.jsDocTags = [...jsDocTags];
  }
  return serialied;
}
