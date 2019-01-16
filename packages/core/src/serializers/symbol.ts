import { parseCommentString } from '@code-to-json/comments';
import { conditionallyMergeTransformed, isRef, refId } from '@code-to-json/utils';
import { flagsToString, mapUem } from '@code-to-json/utils-ts';
import * as ts from 'typescript';
import Collector from '../collector';
import { ProcessingQueue } from '../processing-queue';
import { SymbolRef } from '../types/ref';
import { SerializedSymbol } from '../types/serialized-entities';
import serializeLocation from './location';
import serializeSignature from './signature';

function appendSymbolMap(
  uem: ts.UnderscoreEscapedMap<ts.Symbol> | undefined,
  q: ProcessingQueue,
  checker: ts.TypeChecker,
): SymbolRef[] | undefined {
  if (uem && uem.size > 0) {
    return mapUem(uem, (val: ts.Symbol) => q.queue(val, 'symbol', checker)).filter(isRef);
  }
  return undefined;
}

function typeForSymbol(checker: ts.TypeChecker, symbol: ts.Symbol): ts.Type {
  const { valueDeclaration: _valDecl, flags } = symbol;
  const valueDeclaration = _valDecl as ts.Declaration | undefined;
  if (valueDeclaration) {
    return checker.getTypeOfSymbolAtLocation(symbol, valueDeclaration);
  }
  const declarations = symbol.getDeclarations();
  if (declarations && declarations.length > 0) {
    return checker.getTypeAtLocation(declarations[0]);
  }
  // eslint-disable-next-line no-bitwise
  if (flags & ts.SymbolFlags.Prototype) {
    return checker.getDeclaredTypeOfSymbol(symbol);
  }
  throw new Error(`Could not determine type of symbol ${symbol.name}`);
}

/**
 * Serialize a TS Symbol
 * @param symbol Symbol to serialize
 * @param checker an instance of the TS type checker
 * @param ref Reference to the symbol
 * @param queue Processing queue
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

  const typ = typeForSymbol(checker, symbol);
  if (valueDeclaration && valueDeclaration.getSourceFile().isDeclarationFile) {
    details.external = true;
  }
  details.type = q.queue(typ, 'type', checker);
  if (members) {
    details.members = appendSymbolMap(members, q, checker);
  }
  conditionallyMergeTransformed(details, exports, 'exports', exps =>
    appendSymbolMap(exps, q, checker),
  );
  conditionallyMergeTransformed(details, globalExports, 'globalExports', gexps =>
    appendSymbolMap(gexps, q, checker),
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
    details.location = serializeLocation(sourceFile, pos, end);
    details.sourceFile = q.queue(sourceFile, 'sourceFile', checker);
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
