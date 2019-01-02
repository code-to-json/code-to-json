import { isRef, refId } from '@code-to-json/utils';
import { mapUem } from '@code-to-json/utils-ts';
import {
  displayPartsToString,
  Symbol as Sym,
  SyntaxKind,
  TypeChecker,
  UnderscoreEscapedMap,
} from 'typescript';
import { flagsToString } from '../flags';
import { ProcessingQueue } from '../processing-queue';
import { SymbolRef, TypeRef } from '../processing-queue/ref';
import { HasPosition, SerializedEntity } from '../types';
import serializeLocation from './location';
import serializeSignature, { SerializedSignature } from './signature';

export interface SerializedHeritageClause {
  clauseType: string;
}

export interface SerializedSymbol extends SerializedEntity<'symbol'>, Partial<HasPosition> {
  name: string;
  documentation?: string;
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
  uem: UnderscoreEscapedMap<Sym> | undefined,
  queue: ProcessingQueue,
  checker: TypeChecker,
): SymbolRef[] | undefined {
  if (uem && uem.size > 0) {
    return mapUem(uem, (val: Sym) => queue.queue(val, 'symbol', checker)).filter(isRef);
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
  symbol: Sym,
  checker: TypeChecker,
  ref: SymbolRef,
  queue: ProcessingQueue,
): SerializedSymbol {
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
  details.type = queue.queue(typ, 'type', checker);
  if (members) {
    details.members = appendSymbolMap(members, queue, checker);
  }
  details.exports = appendSymbolMap(exports, queue, checker);
  if (globalExports) {
    details.globalExports = appendSymbolMap(globalExports, queue, checker);
  }

  const docComment = symbol.getDocumentationComment(checker);
  if (docComment.length > 0) {
    details.documentation = displayPartsToString(docComment);
  }
  if (valueDeclaration) {
    const { modifiers, decorators, pos, end } = valueDeclaration;
    const valDeclType = checker.getTypeOfSymbolAtLocation(symbol, valueDeclaration);
    const sourceFile = valueDeclaration.getSourceFile();
    details.location = serializeLocation(sourceFile, pos, end);
    details.sourceFile = queue.queue(sourceFile, 'sourceFile', checker);
    if (modifiers) {
      details.modifiers = modifiers && modifiers.map(m => SyntaxKind[m.kind]);
    }
    if (decorators) {
      details.decorators = decorators && decorators.map(d => SyntaxKind[d.kind]);
    }
    const constructorSignatures = valDeclType
      .getConstructSignatures()
      .map(s => serializeSignature(s, checker, queue));
    if (constructorSignatures && constructorSignatures.length > 0) {
      details.constructorSignatures = constructorSignatures;
    }
    const callSignatures = valDeclType
      .getCallSignatures()
      .map(s => serializeSignature(s, checker, queue));
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
