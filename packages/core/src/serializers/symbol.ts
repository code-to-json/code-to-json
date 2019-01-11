import { CommentData, parseCommentString } from '@code-to-json/comments';
import { conditionallyMergeTransformed, isRef, refId } from '@code-to-json/utils';
import { mapUem } from '@code-to-json/utils-ts';
import * as ts from 'typescript';
import Collector from '../collector';
import { flagsToString } from '../flags';
import { ProcessingQueue } from '../processing-queue';
import { SymbolRef, TypeRef } from '../processing-queue/ref';
import { HasDocumentation, HasPosition, SerializedEntity } from '../types';
import serializeLocation from './location';
import serializeSignature, { SerializedSignature } from './signature';

export interface SerializedHeritageClause {
  clauseType: string;
}

export interface SerializedSymbol
  extends SerializedEntity<'symbol'>,
    Partial<HasPosition>,
    HasDocumentation {
  name: string;
  external?: boolean;
  type?: TypeRef;
  members?: SymbolRef[];
  exports?: SymbolRef[];
  decorators?: string[];
  modifiers?: string[];
  globalExports?: SymbolRef[];
  // declarations?: DeclarationRef[];
  constructorSignatures?: SerializedSignature[];
  callSignatures?: SerializedSignature[];
  heritageClauses?: SerializedHeritageClause[];
  jsDocTags?: Array<{
    name: string;
    text?: string;
  }>;
}

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
  const { exports, globalExports, members, flags, valueDeclaration } = symbol;

  const details: SerializedSymbol = {
    id: refId(ref),
    entity: 'symbol',
    name: symbol.getName(),
    flags: flagsToString(flags, 'symbol'),
  };

  const typ = checker.getTypeOfSymbolAtLocation(symbol, valueDeclaration);
  if (valueDeclaration && valueDeclaration.getSourceFile().isDeclarationFile) {
    details.external = true;
    return details;
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
