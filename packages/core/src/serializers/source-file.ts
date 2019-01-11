import { CommentData, parseCommentString } from '@code-to-json/comments';
import { refId } from '@code-to-json/utils';
import * as ts from 'typescript';
import Collector from '../collector';
import { NodeRef, SourceFileRef, SymbolRef } from '../processing-queue/ref';
import { HasDocumentation, SerializedEntity } from '../types';
import serializeAmdDependency, { SerializedAmdDependency } from './amd-dependency';
import serializeFileReference, { SerializedFileReference } from './file-reference';

function findSourceFileComment(sourceFile: ts.SourceFile): undefined | CommentData {
  const leadingTrivia = sourceFile.getFullText().substr(0, sourceFile.getLeadingTriviaWidth());
  const leadingCommentRanges = ts.getLeadingCommentRanges(leadingTrivia, 0);
  if (!leadingCommentRanges || leadingCommentRanges.length !== 2) {
    return undefined;
  }
  const [fileCommentRange] = leadingCommentRanges;
  const fileComment = sourceFile.text.substr(fileCommentRange.pos, fileCommentRange.end);
  return parseCommentString(fileComment);
}

export interface SerializedSourceFile extends SerializedEntity<'sourceFile'>, HasDocumentation {
  originalFileName?: string;
  moduleName: string;
  extension: string | null;
  pathInPackage: string;

  isDeclarationFile: boolean;
  statements?: NodeRef[];
  symbol?: SymbolRef;
  amdDependencies?: SerializedAmdDependency[];
  referencedFiles?: SerializedFileReference[];
  typeReferenceDirectives?: SerializedFileReference[];
  libReferenceDirectives?: SerializedFileReference[];
}
/**
 * Serialize a SourceFile to a POJO
 * @param sourceFile SourceFile to serialize
 * @param checker A type-checker
 * @param ref Refernece to the SourceFile being serialized
 * @param _queue Processing queue
 */
export default function serializeSourceFile(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
  ref: SourceFileRef,
  c: Collector,
): SerializedSourceFile {
  const {
    fileName,
    isDeclarationFile,
    amdDependencies,
    referencedFiles: _referencedFiles,
    typeReferenceDirectives: _typeReferenceDirectives,
    libReferenceDirectives: _libReferenceDirectives,
    // statements: _statements
  } = sourceFile;
  const { moduleName, extension, relativePath } = c.pathNormalizer.filePathToModuleInfo(fileName);
  // tslint:disable-next-line:no-commented-code
  // const statements = _statements.map(s => _queue.queue(s, 'node', checker)).filter(isRef);

  const basicInfo: SerializedSourceFile = {
    id: refId(ref),
    entity: 'sourceFile',
    originalFileName: fileName,
    isDeclarationFile,
    moduleName,
    extension,
    pathInPackage: relativePath,
    // statements
  };

  if (amdDependencies && amdDependencies.length > 0) {
    basicInfo.amdDependencies = amdDependencies.map(serializeAmdDependency);
  }
  if (_referencedFiles && _referencedFiles.length > 0) {
    basicInfo.referencedFiles = _referencedFiles.map(serializeFileReference);
  }
  if (_typeReferenceDirectives && _typeReferenceDirectives.length > 0) {
    basicInfo.referencedFiles = _typeReferenceDirectives.map(serializeFileReference);
  }
  if (_libReferenceDirectives && _libReferenceDirectives.length > 0) {
    basicInfo.referencedFiles = _libReferenceDirectives.map(serializeFileReference);
  }
  const leadingComments = sourceFile.getFullText().substring(0, sourceFile.getLeadingTriviaWidth());
  const firstClose = leadingComments.indexOf('*/');
  const lastClose = leadingComments.lastIndexOf('*/');
  if (firstClose !== lastClose) {
    const leadingComment = `${leadingComments.split('*/')[0]}*/`;
    basicInfo.documentation = parseCommentString(leadingComment);
  }
  /**
   * Take the source file's AST node, and use the checker
   * to obtain a Symbol (AST + Type Information, via the binder)
   */
  const sym = checker.getSymbolAtLocation(sourceFile);
  if (sym) {
    basicInfo.symbol = c.queue.queue(sym, 'symbol', checker);
  }

  return basicInfo;
}
